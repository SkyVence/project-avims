import {Link} from "@/i18n/routing"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
      <p className="text-muted-foreground mb-6">The item you&apos;re looking for doesn&apos;t exist or has been removed.</p>
      <Button asChild>
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  )
}

