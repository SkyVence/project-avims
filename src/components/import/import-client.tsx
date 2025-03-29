"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import { z } from "zod"
import * as XLSX from "@e965/xlsx"
import Papa from "papaparse"
import { FileSpreadsheet, File, UploadCloud, CheckCircle, AlertCircle, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { Progress } from "../ui/progress"
import { Separator } from "../ui/separator"
import { toast } from "@/hooks/use-toast"
import { createItemBulk } from "../../app/actions/item"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { handleError } from "@/lib/error-handler"

interface ImportItem {
  name: string
  description?: string
  brand: string
  value: number
  insuranceValue: number
  hsCode: string
  location: string
  length: number
  width: number
  height: number
  weight: number
  quantity: number
  categoryName: string
  familyName: string
  subFamilyName: string
}

// Define the item schema for validation
const createItemSchema = (t: ReturnType<typeof useTranslations>) => {
  return z.object({
    name: z.string().min(1, t('import.validation.schema.name.required')),
    description: z.string().optional(),
    brand: z.string().min(1, t('import.validation.schema.brand.required')),
    value: z.number().positive(t('import.validation.schema.value.positive')),
    insuranceValue: z.number().positive(t('import.validation.schema.insuranceValue.positive')),
    hsCode: z.string().min(1, t('import.validation.schema.hsCode.required')),
    location: z.string().min(1, t('import.validation.schema.location.required')),
    length: z.number().positive(t('import.validation.schema.dimensions.length')),
    width: z.number().positive(t('import.validation.schema.dimensions.width')),
    height: z.number().positive(t('import.validation.schema.dimensions.height')),
    weight: z.number().positive(t('import.validation.schema.weight.positive')),
    quantity: z.number().int().positive(t('import.validation.schema.quantity.positive')).default(1),
    categoryName: z.string().min(1, t('import.validation.schema.category.required')),
    familyName: z.string().min(1, t('import.validation.schema.family.required')),
    subFamilyName: z.string().min(1, t('import.validation.schema.subfamily.required')),
  })
}

interface ImportClientProps {
  categories: {
    id: string
    name: string
    families: {
      id: string
      name: string
      subFamilies: {
        id: string
        name: string
      }[]
    }[]
  }[]
}

export function ImportClient({ categories }: ImportClientProps) {
  const t = useTranslations()
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<ImportItem[]>([])
  const [validationErrors, setValidationErrors] = useState<Record<number, string[]>>({})
  const [isImporting, setIsImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState<string>("upload")
  const [importResult, setImportResult] = useState<{
    success: number
    failed: number
    complete: boolean
  }>({
    success: 0,
    failed: 0,
    complete: false,
  })

  // Handle file drop
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length === 0) return
      handleFile(acceptedFiles[0])
    },
  })

  // Process the uploaded file
  const handleFile = async (uploadedFile: File) => {
    setFile(uploadedFile)
    setValidationErrors({})
    setImportResult({ success: 0, failed: 0, complete: false })
    setActiveTab("preview")
    
    try {
      let data: any[] = []
      
      if (uploadedFile.name.endsWith('.csv')) {
        const text = await uploadedFile.text()
        const result = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
        })
        data = result.data
      } else if (uploadedFile.name.endsWith('.xlsx')) {
        const arrayBuffer = await uploadedFile.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer)
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        data = XLSX.utils.sheet_to_json(worksheet)
      }
      
      validateData(data)
    } catch (error) {
      handleError(error, {
        title: t('import.toast.error.title'),
        defaultMessage: t('import.toast.error.fileProcessing')
      })
    }
  }

  // Validate the parsed data
  const validateData = (data: any[]) => {
    const validItems: ImportItem[] = []
    const errors: Record<number, string[]> = {}
    const schema = createItemSchema(t)
    
    data.forEach((row, index) => {
      try {
        const processedRow = {
          ...row,
          value: parseFloat(row.value),
          insuranceValue: parseFloat(row.insuranceValue),
          length: parseFloat(row.length),
          width: parseFloat(row.width),
          height: parseFloat(row.height),
          weight: parseFloat(row.weight),
          quantity: parseInt(row.quantity || "1"),
        }
        
        const validatedRow = schema.parse(processedRow)
        validItems.push(validatedRow)
      } catch (error) {
        if (error instanceof z.ZodError) {
          errors[index] = error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
        } else {
          errors[index] = ["Unknown validation error"]
        }
      }
    })
    
    setParsedData(validItems)
    setValidationErrors(errors)
  }

  // Import the validated data
  const handleImport = async () => {
    if (parsedData.length === 0) {
      handleError(t('import.toast.error.noData'), {
        title: t('import.toast.error.title'),
        variant: "destructive"
      })
      return
    }
    
    try {
      setIsImporting(true)
      let successCount = 0
      let failedCount = 0
      
      const batchSize = 10
      const batches = Math.ceil(parsedData.length / batchSize)
      
      for (let i = 0; i < batches; i++) {
        const start = i * batchSize
        const end = Math.min(start + batchSize, parsedData.length)
        const batch = parsedData.slice(start, end)
        
        const itemsWithIds = batch.map((item: ImportItem) => {
          const category = categories.find(cat => cat.name === item.categoryName)
          if (!category) throw new Error(t('import.validation.schema.category.notFound', { name: item.categoryName }))
          
          const family = category.families.find(fam => fam.name === item.familyName)
          if (!family) throw new Error(t('import.validation.schema.family.notFound', { name: item.familyName }))
          
          const subFamily = family.subFamilies.find(sub => sub.name === item.subFamilyName)
          if (!subFamily) throw new Error(t('import.validation.schema.subfamily.notFound', { name: item.subFamilyName }))
          
          return {
            ...item,
            categoryId: category.id,
            familyId: family.id,
            subFamilyId: subFamily.id
          }
        })
        
        const result = await createItemBulk(itemsWithIds)
        
        successCount += result.success
        failedCount += result.failed
        
        // Update progress
        setProgress(Math.round(((i + 1) / batches) * 100))
      }
      
      setImportResult({
        success: successCount,
        failed: failedCount,
        complete: true,
      })
      
      toast({
        title: t('import.toast.success.title'),
        description: t('import.toast.success.description', { success: successCount, failed: failedCount })
      })
      
      // Refresh the items list
      router.refresh()
      
    } catch (error) {
      handleError(error, {
        title: t('import.toast.error.title'),
        defaultMessage: t('import.toast.error.description')
      })
    } finally {
      setIsImporting(false)
      setActiveTab("result")
    }
  }
  
  // Reset the import process
  const resetImport = () => {
    setFile(null)
    setParsedData([])
    setValidationErrors({})
    setProgress(0)
    setImportResult({ success: 0, failed: 0, complete: false })
    setActiveTab("upload")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('import.title')}</CardTitle>
        <CardDescription>{t('import.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="upload">{t('import.tabs.upload')}</TabsTrigger>
            <TabsTrigger value="preview">{t('import.tabs.preview')}</TabsTrigger>
            <TabsTrigger value="result">{t('import.tabs.result')}</TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                isDragActive ? 'border-primary' : 'border-border'
              }`}
            >
              <input {...getInputProps()} />
              <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-semibold">{t('import.dropzone.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('import.dropzone.description')}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t('import.dropzone.acceptedFormats')}</p>
            </div>
          </TabsContent>
          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <File className="h-5 w-5" />
                  File Preview: {file?.name}
                </CardTitle>
                <CardDescription>
                  Review the data before importing. Fix any validation errors in your file if needed.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.keys(validationErrors).length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Validation Errors</AlertTitle>
                    <AlertDescription>
                      There are {Object.keys(validationErrors).length} rows with errors. Please fix them and upload again.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="rounded-md border">
                  <div className="grid grid-cols-4 gap-4 border-b bg-muted/50 p-3 font-medium">
                    <div>Name</div>
                    <div>Brand</div>
                    <div>Category / Family / Subfamily</div>
                    <div>Value</div>
                  </div>
                  <div className="max-h-80 overflow-auto">
                    {parsedData.length > 0 ? (
                      parsedData.map((item, index) => (
                        <div key={index} className="grid grid-cols-4 gap-4 border-b p-3 text-sm">
                          <div>{item.name}</div>
                          <div>{item.brand}</div>
                          <div>{item.categoryName} / {item.familyName} / {item.subFamilyName}</div>
                          <div>{item.value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-muted-foreground">
                        No valid data found in the file.
                      </div>
                    )}
                  </div>
                </div>

                {Object.keys(validationErrors).length > 0 && (
                  <div className="rounded-md border">
                    <div className="bg-muted/50 p-3 font-medium">Validation Errors</div>
                    <div className="max-h-64 overflow-auto p-3">
                      {Object.entries(validationErrors).map(([rowIndex, errors]) => (
                        <div key={rowIndex} className="mb-2 rounded-md border p-2">
                          <div className="font-medium">Row {parseInt(rowIndex) + 1}:</div>
                          <ul className="ml-5 mt-1 list-disc text-sm text-destructive">
                            {errors.map((error, i) => (
                              <li key={i}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={resetImport} disabled={isImporting}>
                  <X className="mr-2 h-4 w-4" />
                  {t('import.buttons.reset')}
                </Button>
                <Button 
                  onClick={handleImport} 
                  disabled={
                    isImporting || 
                    parsedData.length === 0 || 
                    Object.keys(validationErrors).length > 0
                  }
                >
                  <UploadCloud className="mr-2 h-4 w-4" />
                  {isImporting ? t('import.buttons.importing') : t('import.buttons.import')}
                </Button>
              </CardFooter>
            </Card>
            {isImporting && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Importing items...</span>
                      <span className="text-sm font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="result">
            <Card>
              <CardHeader>
                <CardTitle>Import Results</CardTitle>
                <CardDescription>
                  Summary of the import operation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-center gap-8">
                  <div className="flex flex-col items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="mt-2 text-2xl font-bold">{importResult.success}</h3>
                    <p className="text-sm text-muted-foreground">Items imported</p>
                  </div>
                  
                  <Separator orientation="vertical" className="h-24" />
                  
                  <div className="flex flex-col items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                      <AlertCircle className="h-8 w-8 text-destructive" />
                    </div>
                    <h3 className="mt-2 text-2xl font-bold">{importResult.failed}</h3>
                    <p className="text-sm text-muted-foreground">Items failed</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={resetImport}>
                  {t('import.buttons.reset')}
                </Button>
                <Button asChild>
                  <a href="/items">View Items</a>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 