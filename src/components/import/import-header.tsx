import Link from "next/link"
import { Button } from "../ui/button"
import { FileDown, Upload } from "lucide-react"

export function ImportHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Import Items</h1>
        <p className="text-muted-foreground">
          Import items from Excel (.xlsx) or CSV files
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link href="/import/template">
            <FileDown className="mr-2 h-4 w-4" />
            Download Template
          </Link>
        </Button>
        <Button asChild>
          <Link href="/items">
            <Upload className="mr-2 h-4 w-4" />
            View Items
          </Link>
        </Button>
      </div>
    </div>
  )
} 