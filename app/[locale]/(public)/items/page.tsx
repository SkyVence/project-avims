import { DataTable } from '@/components/ItemDataTableUI/data-table'
import { columns } from '@/components/ItemDataTableUI/ItemColumns'
import { getAllItems } from '@/lib/dataFetching'

export default async function Home() {
  const itemData = await getAllItems()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={itemData} enableFilters={true}/>
    </div>
  )
}