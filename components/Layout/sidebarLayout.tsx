import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { SidebarUI } from "@/components/sidebarUI/sidebarUi";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SidebarUI />
      <main>
        <SidebarTrigger/>
        {children}
      </main>
    </SidebarProvider>
  );
}
