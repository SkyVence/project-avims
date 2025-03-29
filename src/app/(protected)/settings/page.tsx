import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { AppearanceSettings } from "@/components/settings/appearance-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { LanguageSettings } from "@/components/settings/language-settings"
import { getAuthenticatedUser } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Settings | Inventory Management System",
  description: "Manage your account settings and preferences",
}

export default async function SettingsPage() {
  const user = await getAuthenticatedUser()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications" disabled>Notifications</TabsTrigger>
		  <TabsTrigger value="language">Language</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <ProfileSettings user={user} />
        </TabsContent>
        <TabsContent value="appearance" className="space-y-4">
          <AppearanceSettings />
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <NotificationSettings />
        </TabsContent>
		<TabsContent value="language" className="space-y-4">
			<LanguageSettings />
		</TabsContent>
      </Tabs>
    </div>
  )
}

