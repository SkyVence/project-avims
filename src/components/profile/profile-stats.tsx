import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Box, Package, Truck } from "lucide-react"

interface ProfileStatsProps {
  itemCount: number
  packageCount: number
  operationCount: number
}

export function ProfileStats({ itemCount, packageCount, operationCount }: ProfileStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
        <CardDescription>Your inventory management statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border p-4">
            <div className="rounded-full bg-primary/10 p-2">
              <Box className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">{itemCount}</h3>
            <p className="text-sm text-muted-foreground">Items Created</p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border p-4">
            <div className="rounded-full bg-primary/10 p-2">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">{packageCount}</h3>
            <p className="text-sm text-muted-foreground">Packages Created</p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border p-4">
            <div className="rounded-full bg-primary/10 p-2">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">{operationCount}</h3>
            <p className="text-sm text-muted-foreground">Operations Created</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

