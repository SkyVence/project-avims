import { EditItemForm } from "@/components/CreateUI/edit/edit-item-form"

interface EditPageProps {
  params: {
    id: string
  }
}

export default async function EditPage({ params }: EditPageProps) {
  const { id } = params

  return <EditItemForm id={id} />
}

 