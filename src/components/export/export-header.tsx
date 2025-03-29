import Link from "next/link"
import { Button } from "../ui/button"
import { FileUp, Package, PackageCheck } from "lucide-react"

export function ExportHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Export Data</h1>
        <p className="text-muted-foreground">
          Export operations and packages to Excel (.xlsx) or CSV files
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link href="/packages">
            <Package className="mr-2 h-4 w-4" />
            View Packages
          </Link>
        </Button>
        <Button asChild>
          <Link href="/operations">
            <PackageCheck className="mr-2 h-4 w-4" />
            View Operations
          </Link>
        </Button>
      </div>
    </div>
  )
} 