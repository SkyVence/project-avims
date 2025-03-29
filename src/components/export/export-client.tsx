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
  
  // Handle export action
  const handleExport = async () => {
    if (selectedOperations.size === 0 && selectedPackages.size === 0) {
      handleError("Please select at least one operation or package to export.", {
        title: "No items selected",
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
        title: "Export successful",
        description: `Exported ${selectedOperations.size} operations and ${selectedPackages.size} packages`,
      })
    } catch (error) {
      handleError(error, {
        title: "Export failed",
        defaultMessage: "An error occurred during export"
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
      ["Inventory Export Summary"],
      ["Generated on", new Date().toLocaleString()],
      [""],
      ["Exported Operations", data.operations.length],
      ["Exported Packages", data.packages.length],
      ["Include detailed items", includeDetailedItems ? "Yes" : "No"],
    ]
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary")
    
    // Create operations sheet if there are operations
    if (data.operations.length > 0) {
      // Create a sheet for operations without items
      const operationsData = data.operations.map((op: any) => ({
        "ID": op.id,
        "Name": op.name,
        "Description": op.description || "",
        "Location": op.location || "",
        "Year": op.year || "",
        "Active": op.active ? "Yes" : "No",
        "Items Count": op.items?.length || 0,
      }))
      
      const operationsSheet = XLSX.utils.json_to_sheet(operationsData)
      XLSX.utils.book_append_sheet(workbook, operationsSheet, "Operations")
      
      // If detailed items are included, create an operations items sheet
      if (includeDetailedItems) {
        const operationItemsData: any[] = []
        
        // Flatten operation items for the sheet
        data.operations.forEach((op: any) => {
          if (op.items && op.items.length > 0) {
            op.items.forEach((item: any) => {
              operationItemsData.push({
                "Operation ID": op.id,
                "Operation Name": op.name,
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
          
          if (op.packages && op.packages.length > 0) {
            op.packages.forEach((pkg: any) => {
              operationItemsData.push({
                "Operation ID": op.id,
                "Operation Name": op.name,
                "Package ID": pkg.packageId,
                "Package Name": pkg.package?.name || "",
                "Type": "Package",
                "Quantity": pkg.quantity || 1,
              })
            })
          }
        })
        
        if (operationItemsData.length > 0) {
          const operationItemsSheet = XLSX.utils.json_to_sheet(operationItemsData)
          XLSX.utils.book_append_sheet(workbook, operationItemsSheet, "Operation Items")
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
    
    // Generate and download the file
    const fileName = `inventory-export-${new Date().toISOString().slice(0, 10)}.xlsx`
    XLSX.writeFile(workbook, fileName)
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
    <Tabs defaultValue="operations" className="space-y-6">
      <div className="flex justify-between items-end">
        <TabsList>
          <TabsTrigger value="operations" className="flex gap-2 items-center">
            <PackageCheck className="h-4 w-4" />
            Operations ({operations.length})
          </TabsTrigger>
          <TabsTrigger value="packages" className="flex gap-2 items-center">
            <Package className="h-4 w-4" />
            Packages ({packages.length})
          </TabsTrigger>
        </TabsList>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="includeItems" 
              checked={includeDetailedItems}
              onCheckedChange={(checked) => setIncludeDetailedItems(!!checked)}
            />
            <Label htmlFor="includeItems">Include detailed items</Label>
          </div>
          
          <Select 
            value={exportFormat} 
            onValueChange={(value) => setExportFormat(value as "xlsx" | "csv")}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Export format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xlsx">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Excel (.xlsx)</span>
                </div>
              </SelectItem>
              <SelectItem value="csv">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>CSV (.csv)</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export Selected
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <TabsContent value="operations" className="space-y-4">
            {operations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox 
                        checked={areAllOperationsSelected} 
                        onCheckedChange={selectAllOperations}
                        aria-label="Select all operations"
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead className="text-right">Items</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operations.map((operation) => (
                    <TableRow key={operation.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedOperations.has(operation.id)}
                          onCheckedChange={() => toggleOperation(operation.id)}
                          aria-label={`Select operation ${operation.name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{operation.name}</TableCell>
                      <TableCell>{operation.description || "-"}</TableCell>
                      <TableCell>{operation.location || "-"}</TableCell>
                      <TableCell>{operation.year || "-"}</TableCell>
                      <TableCell className="text-right">{operation._count.operationItems}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No operations found
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="packages" className="space-y-4">
            {packages.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox 
                        checked={areAllPackagesSelected} 
                        onCheckedChange={selectAllPackages}
                        aria-label="Select all packages"
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead className="text-right">Items</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedPackages.has(pkg.id)}
                          onCheckedChange={() => togglePackage(pkg.id)}
                          aria-label={`Select package ${pkg.name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{pkg.name}</TableCell>
                      <TableCell>{pkg.description || "-"}</TableCell>
                      <TableCell>{pkg.location || "-"}</TableCell>
                      <TableCell>{pkg.year || "-"}</TableCell>
                      <TableCell className="text-right">{pkg._count.packageItems}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No packages found
              </div>
            )}
          </TabsContent>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              {selectedOperations.size > 0 && `${selectedOperations.size} operations selected. `}
              {selectedPackages.size > 0 && `${selectedPackages.size} packages selected.`}
              {selectedOperations.size === 0 && selectedPackages.size === 0 && "No items selected"}
            </div>
            <div className="flex items-center gap-2">
              {(selectedOperations.size > 0 || selectedPackages.size > 0) && (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </Tabs>
  )
} 