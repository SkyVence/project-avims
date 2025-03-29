import { AppBreadcrumbs } from "./app-breadcrumbs"
import { Separator } from "./ui/separator"
import { SidebarTrigger } from "./ui/sidebar"

export default function AppSidebarHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-background/80 backdrop-blur-sm border-b">
      <div className="flex items-center gap-2 px-4 w-full">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-6 w-[1.5px]" />
        <AppBreadcrumbs />
      </div>
    </header>
  )
}

