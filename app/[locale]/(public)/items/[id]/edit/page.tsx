"use client"
import { EditItemForm } from "@/components/CreateUI/edit/edit-item-form"

// Correct type definition for page params
interface PageProps {
  params: {
    id: string
  }
}

export default function EditPage({ params }: PageProps) {
  // No need to use the 'use' hook here as params is not a Promise
  const id = params.id

  return <EditItemForm id={id} />
}

