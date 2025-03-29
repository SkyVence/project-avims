import { NextResponse } from "next/server"
import * as XLSX from "@e965/xlsx"
import { getAuthenticatedUser } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    // Verify the user is authenticated
    await getAuthenticatedUser()
    
    // Create a new workbook
    const workbook = XLSX.utils.book_new()
    
    // Sample data with headers and one example row
    const data = [
      {
        name: "Sample Item",
        description: "This is a sample item description",
        brand: "Brand Name",
        value: 100,
        insuranceValue: 120,
        hsCode: "12345678",
        location: "Storage Room A",
        length: 10,
        width: 5,
        height: 3,
        weight: 2,
        quantity: 1,
        categoryName: "", // This will be filled with a valid category from the database
        familyName: "",   // This will be filled with a valid family from the database
        subFamilyName: "" // This will be filled with a valid subfamily from the database
      }
    ]
    
    // Get a real category, family, and subfamily from the database to use as an example
    const categoryWithRelations = await prisma.category.findFirst({
      include: {
        families: {
          include: {
            subFamilies: true
          }
        }
      },
      where: {
        families: {
          some: {
            subFamilies: {
              some: {}
            }
          }
        }
      }
    })
    
    // If we found a valid category with relations, use it for the example
    if (categoryWithRelations 
        && categoryWithRelations.families.length > 0 
        && categoryWithRelations.families[0].subFamilies.length > 0) {
      
      const family = categoryWithRelations.families[0]
      const subFamily = family.subFamilies[0]
      
      data[0].categoryName = categoryWithRelations.name
      data[0].familyName = family.name
      data[0].subFamilyName = subFamily.name
    }
    
    // Create a worksheet from the data
    const worksheet = XLSX.utils.json_to_sheet(data)
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Items")
    
    // Generate Excel file buffer
    const fileBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })
    
    // Set appropriate headers for file download
    const headers = new Headers()
    headers.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    headers.set("Content-Disposition", "attachment; filename=item-import-template.xlsx")
    
    return new NextResponse(fileBuffer, { headers })
  } catch (error) {
    console.error("Error generating template:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to generate template" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
} 