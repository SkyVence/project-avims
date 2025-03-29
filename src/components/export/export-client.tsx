"use client"

import { useState } from "react"
import * as XLSX from "@e965/xlsx"
import Papa from "papaparse"
import { 
  FileSpreadsheet, 
  FileText, 
  Download, 
  CheckCircle2, 
  Package, 
  PackageCheck,
  Loader2
} from "lucide-react"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "../ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { fetchPackageDetails, fetchOperationDetails } from "../../app/actions/export"
import { toast } from "@/hooks/use-toast"
import { handleError } from "@/lib/error-handler"
import { useTranslations } from "next-intl"

interface Operation {
  id: string
  name: string
  description: string | null
  location: string | null
  year: number | null
  active: boolean
  _count: {
    operationItems: number
  }
}

interface Package {
  id: string
  name: string
  description: string | null
  location: string | null
  year: number | null
  active: boolean
  _count: {
    packageItems: number
  }
}

interface ExportClientProps {
  operations: Operation[]
  packages: Package[]
}

export function ExportClient({ operations, packages }: ExportClientProps) {
  // Selected entities for export
  const [selectedOperations, setSelectedOperations] = useState<Set<string>>(new Set())
  const [selectedPackages, setSelectedPackages] = useState<Set<string>>(new Set())
  
  // Export format selection
  const [exportFormat, setExportFormat] = useState<"xlsx" | "csv">("xlsx")
  
  // Loading state
  const [isExporting, setIsExporting] = useState(false)
  
  // Include detailed items toggle
  const [includeDetailedItems, setIncludeDetailedItems] = useState(true)
  
  // Translations hook
  const t = useTranslations()
  
  // Helper function to download files
  const downloadFile = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
  
  // Handle export action
  const handleExport = async () => {
    if (selectedOperations.size === 0 && selectedPackages.size === 0) {
      handleError(t('export.client.errors.noSelection'), {
        title: t('export.client.errors.noSelectionTitle'),
        variant: "destructive"
      })
      return
    }
    
    try {
      setIsExporting(true)
      
      // Fetch detailed data for selected operations and packages
      const operationPromises = Array.from(selectedOperations).map(id => 
        fetchOperationDetails(id, includeDetailedItems)
      )
      
      const packagePromises = Array.from(selectedPackages).map(id => 
        fetchPackageDetails(id, includeDetailedItems)
      )
      
      // Wait for all data to be fetched
      const [operationDetails, packageDetails] = await Promise.all([
        Promise.all(operationPromises),
        Promise.all(packagePromises)
      ])
      
      // Prepare data for export
      const exportData = {
        operations: operationDetails,
        packages: packageDetails
      }
      
      // Generate the file based on selected format
      if (exportFormat === "xlsx") {
        generateExcelFile(exportData)
      } else {
        generateCsvFile(exportData)
      }
      
      // Show success message
      toast({
        title: t('export.client.toast.success.title'),
        description: t('export.client.toast.success.description', { 
          operations: selectedOperations.size, 
          packages: selectedPackages.size 
        }),
      })
    } catch (error) {
      handleError(error, {
        title: t('export.client.toast.error.title'),
        defaultMessage: t('export.client.toast.error.description')
      })
    } finally {
      setIsExporting(false)
    }
  }
  
  // Generate Excel file
  const generateExcelFile = (data: any) => {
    const workbook = XLSX.utils.book_new()
    
    // Add a summary sheet
    const summaryData = [
      [t('export.client.excel.summary.title')],
      [t('export.client.excel.summary.generatedOn'), new Date().toLocaleString()],
      [""],
      [t('export.client.excel.summary.exportedOperations'), data.operations.length],
      [t('export.client.excel.summary.exportedPackages'), data.packages.length],
      [t('export.client.excel.summary.includeDetailedItems'), includeDetailedItems ? t('export.client.excel.summary.yes') : t('export.client.excel.summary.no')],
    ]
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(workbook, summarySheet, t('export.client.excel.sheets.summary'))
    
    // Create operations sheet if there are operations
    if (data.operations.length > 0) {
      // Create a sheet for operations without items
      const operationsData = data.operations.map((op: any) => ({
        [t('export.client.excel.columns.id')]: op.id,
        [t('export.client.excel.columns.name')]: op.name,
        [t('export.client.excel.columns.description')]: op.description || "",
        [t('export.client.excel.columns.location')]: op.location || "",
        [t('export.client.excel.columns.year')]: op.year || "",
        [t('export.client.excel.columns.active')]: op.active ? t('export.client.excel.summary.yes') : t('export.client.excel.summary.no'),
        [t('export.client.excel.columns.itemsCount')]: op.items?.length || 0,
      }))
      
      const operationsSheet = XLSX.utils.json_to_sheet(operationsData)
      XLSX.utils.book_append_sheet(workbook, operationsSheet, t('export.client.excel.sheets.operations'))
      
      // If detailed items are included, create an operations items sheet
      if (includeDetailedItems) {
        const operationItemsData: any[] = []
        
        // Flatten operation items for the sheet
        data.operations.forEach((op: any) => {
          if (op.items && op.items.length > 0) {
            op.items.forEach((item: any) => {
              operationItemsData.push({
                [t('export.client.excel.columns.operationId')]: op.id,
                [t('export.client.excel.columns.operationName')]: op.name,
                [t('export.client.excel.columns.itemId')]: item.id,
                [t('export.client.excel.columns.itemName')]: item.name,
                [t('export.client.excel.columns.brand')]: item.brand || "",
                [t('export.client.excel.columns.value')]: item.value || "",
                [t('export.client.excel.columns.hsCode')]: item.hsCode || "",
                [t('export.client.excel.columns.location')]: item.location || "",
                [t('export.client.excel.columns.quantity')]: item.quantity || 1,
                [t('export.client.excel.columns.category')]: item.category?.name || "",
                [t('export.client.excel.columns.family')]: item.family?.name || "",
                [t('export.client.excel.columns.subfamily')]: item.subFamily?.name || "",
              })
            })
          }
          
          if (op.packages && op.packages.length > 0) {
            op.packages.forEach((pkg: any) => {
              operationItemsData.push({
                [t('export.client.excel.columns.operationId')]: op.id,
                [t('export.client.excel.columns.operationName')]: op.name,
                [t('export.client.excel.columns.packageId')]: pkg.packageId,
                [t('export.client.excel.columns.packageName')]: pkg.package?.name || "",
                [t('export.client.excel.columns.type')]: t('export.client.excel.values.package'),
                [t('export.client.excel.columns.quantity')]: pkg.quantity || 1,
              })
            })
          }
        })
        
        if (operationItemsData.length > 0) {
          const operationItemsSheet = XLSX.utils.json_to_sheet(operationItemsData)
          XLSX.utils.book_append_sheet(workbook, operationItemsSheet, t('export.client.excel.sheets.operationItems'))
        }
      }
    }
    
    // Create packages sheet if there are packages
    if (data.packages.length > 0) {
      // Create a sheet for packages without items
      const packagesData = data.packages.map((pkg: any) => ({
        "ID": pkg.id,
        "Name": pkg.name,
        "Description": pkg.description || "",
        "Location": pkg.location || "",
        "Year": pkg.year || "",
        "Active": pkg.active ? "Yes" : "No",
        "Items Count": pkg.items?.length || 0,
      }))
      
      const packagesSheet = XLSX.utils.json_to_sheet(packagesData)
      XLSX.utils.book_append_sheet(workbook, packagesSheet, "Packages")
      
      // If detailed items are included, create a packages items sheet
      if (includeDetailedItems) {
        const packageItemsData: any[] = []
        
        // Flatten package items for the sheet
        data.packages.forEach((pkg: any) => {
          if (pkg.items && pkg.items.length > 0) {
            pkg.items.forEach((item: any) => {
              packageItemsData.push({
                "Package ID": pkg.id,
                "Package Name": pkg.name,
                "Item ID": item.id,
                "Item Name": item.name,
                "Brand": item.brand || "",
                "Value": item.value || "",
                "HS Code": item.hsCode || "",
                "Location": item.location || "",
                "Quantity": item.quantity || 1,
                "Category": item.category?.name || "",
                "Family": item.family?.name || "",
                "SubFamily": item.subFamily?.name || "",
              })
            })
          }
        })
        
        if (packageItemsData.length > 0) {
          const packageItemsSheet = XLSX.utils.json_to_sheet(packageItemsData)
          XLSX.utils.book_append_sheet(workbook, packageItemsSheet, "Package Items")
        }
      }
    }
    
    // Generate and download the Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    downloadFile(blob, `inventory-export-${new Date().toISOString().split("T")[0]}.xlsx`)
  }
  
  // Generate CSV file
  const generateCsvFile = (data: any) => {
    // Since CSV is single-sheet, we'll create a zip file with multiple CSVs
    // For simplicity in this example, we'll just export the first data set
    
    // Create a combined dataset with metadata to identify each item
    const csvData: any[] = []
    
    // Add metadata
    csvData.push({
      "Type": "METADATA",
      "ExportDate": new Date().toISOString(),
      "OperationsCount": data.operations.length,
      "PackagesCount": data.packages.length,
      "IncludeDetailedItems": includeDetailedItems ? "Yes" : "No"
    })
    
    // Add operations
    data.operations.forEach((op: any) => {
      csvData.push({
        "Type": "OPERATION",
        "ID": op.id,
        "Name": op.name,
        "Description": op.description || "",
        "Location": op.location || "",
        "Year": op.year || "",
        "Active": op.active ? "Yes" : "No",
        "ItemsCount": op.items?.length || 0
      })
      
      // Add operation items if detailed items are included
      if (includeDetailedItems && op.items) {
        op.items.forEach((item: any) => {
          csvData.push({
            "Type": "OPERATION_ITEM",
            "OperationID": op.id,
            "ItemID": item.id,
            "ItemName": item.name,
            "Brand": item.brand || "",
            "Value": item.value || "",
            "HSCode": item.hsCode || "",
            "Location": item.location || "",
            "Quantity": item.quantity || 1,
            "Category": item.category?.name || "",
            "Family": item.family?.name || "",
            "SubFamily": item.subFamily?.name || ""
          })
        })
      }
      
      // Add operation packages if detailed items are included
      if (includeDetailedItems && op.packages) {
        op.packages.forEach((pkg: any) => {
          csvData.push({
            "Type": "OPERATION_PACKAGE",
            "OperationID": op.id,
            "PackageID": pkg.packageId,
            "PackageName": pkg.package?.name || "",
            "Quantity": pkg.quantity || 1
          })
        })
      }
    })
    
    // Add packages
    data.packages.forEach((pkg: any) => {
      csvData.push({
        "Type": "PACKAGE",
        "ID": pkg.id,
        "Name": pkg.name,
        "Description": pkg.description || "",
        "Location": pkg.location || "",
        "Year": pkg.year || "",
        "Active": pkg.active ? "Yes" : "No",
        "ItemsCount": pkg.items?.length || 0
      })
      
      // Add package items if detailed items are included
      if (includeDetailedItems && pkg.items) {
        pkg.items.forEach((item: any) => {
          csvData.push({
            "Type": "PACKAGE_ITEM",
            "PackageID": pkg.id,
            "ItemID": item.id,
            "ItemName": item.name,
            "Brand": item.brand || "",
            "Value": item.value || "",
            "HSCode": item.hsCode || "",
            "Location": item.location || "",
            "Quantity": item.quantity || 1,
            "Category": item.category?.name || "",
            "Family": item.family?.name || "",
            "SubFamily": item.subFamily?.name || ""
          })
        })
      }
    })
    
    // Convert to CSV
    const csv = Papa.unparse(csvData)
    
    // Create a Blob and download the file
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `inventory-export-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  // Toggle selection of an operation
  const toggleOperation = (id: string) => {
    const newSelected = new Set(selectedOperations)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedOperations(newSelected)
  }
  
  // Toggle selection of a package
  const togglePackage = (id: string) => {
    const newSelected = new Set(selectedPackages)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedPackages(newSelected)
  }
  
  // Select all operations
  const selectAllOperations = () => {
    if (selectedOperations.size === operations.length) {
      setSelectedOperations(new Set())
    } else {
      setSelectedOperations(new Set(operations.map(op => op.id)))
    }
  }
  
  // Select all packages
  const selectAllPackages = () => {
    if (selectedPackages.size === packages.length) {
      setSelectedPackages(new Set())
    } else {
      setSelectedPackages(new Set(packages.map(pkg => pkg.id)))
    }
  }
  
  // Check if all operations are selected
  const areAllOperationsSelected = operations.length > 0 && selectedOperations.size === operations.length
  
  // Check if all packages are selected
  const areAllPackagesSelected = packages.length > 0 && selectedPackages.size === packages.length
  
  return (
    <Tabs defaultValue="selection" className="space-y-4">
      <TabsList>
        <TabsTrigger value="selection">{t('export.client.tabs.selection')}</TabsTrigger>
        <TabsTrigger value="options">{t('export.client.tabs.options')}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="selection" className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Operations selection card */}
          <Card>
            <CardHeader>
              <CardTitle>{t('export.client.cards.operations.title')}</CardTitle>
              <CardDescription>{t('export.client.cards.operations.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={selectAllOperations}
                  disabled={operations.length === 0}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {t('export.client.buttons.selectAll')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedOperations(new Set())}
                  disabled={selectedOperations.size === 0}
                >
                  {t('export.client.buttons.clearSelection')}
                </Button>
              </div>
              
              {operations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {t('export.client.noData.operations')}
                </div>
              ) : (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>{t('export.client.table.columns.name')}</TableHead>
                        <TableHead>{t('export.client.table.columns.items')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {operations.map((operation) => (
                        <TableRow key={operation.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedOperations.has(operation.id)}
                              onCheckedChange={() => toggleOperation(operation.id)}
                            />
                          </TableCell>
                          <TableCell>{operation.name}</TableCell>
                          <TableCell>{operation._count.operationItems}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Packages selection card */}
          <Card>
            <CardHeader>
              <CardTitle>{t('export.client.cards.packages.title')}</CardTitle>
              <CardDescription>{t('export.client.cards.packages.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={selectAllPackages}
                  disabled={packages.length === 0}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {t('export.client.buttons.selectAll')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedPackages(new Set())}
                  disabled={selectedPackages.size === 0}
                >
                  {t('export.client.buttons.clearSelection')}
                </Button>
              </div>
              
              {packages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {t('export.client.noData.packages')}
                </div>
              ) : (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>{t('export.client.table.columns.name')}</TableHead>
                        <TableHead>{t('export.client.table.columns.items')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {packages.map((pkg) => (
                        <TableRow key={pkg.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedPackages.has(pkg.id)}
                              onCheckedChange={() => togglePackage(pkg.id)}
                            />
                          </TableCell>
                          <TableCell>{pkg.name}</TableCell>
                          <TableCell>{pkg._count.packageItems}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="options">
        <Card>
          <CardHeader>
            <CardTitle>{t('export.client.cards.options.title')}</CardTitle>
            <CardDescription>{t('export.client.cards.options.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t('export.client.options.fileFormat')}</Label>
              <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xlsx">
                    <div className="flex items-center">
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      <span>{t('export.client.options.formats.excel')}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>{t('export.client.options.formats.csv')}</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeDetailedItems" 
                checked={includeDetailedItems} 
                onCheckedChange={(checked) => setIncludeDetailedItems(!!checked)}
              />
              <Label htmlFor="includeDetailedItems">
                {t('export.client.options.includeDetailedItems')}
              </Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleExport} 
              disabled={isExporting || (selectedOperations.size === 0 && selectedPackages.size === 0)}
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('export.client.buttons.exporting')}
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  {t('export.client.buttons.export')}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
} 