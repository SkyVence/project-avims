"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Switch } from "../ui/switch"
import { Label } from "../ui/label"
import { toast } from "@/hooks/use-toast"
import { useTranslations } from "next-intl"

export function NotificationSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    inventory: true,
    operations: true,
    system: false,
  })
  const t = useTranslations()

  function onSubmit() {
    setIsLoading(true)

    try {
      // Here you would update the notification settings
      toast({
        title: t('notificationSettings.toast.success.title'),
        description: t('notificationSettings.toast.success.description'),
      })
    } catch (error) {
      toast({
        title: t('notificationSettings.toast.error.title'),
        description: t('notificationSettings.toast.error.description'),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('notificationSettings.title')}</CardTitle>
        <CardDescription>{t('notificationSettings.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t('notificationSettings.methods.title')}</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">{t('notificationSettings.methods.email.label')}</Label>
                <p className="text-sm text-muted-foreground">{t('notificationSettings.methods.email.description')}</p>
              </div>
              <Switch
                id="email-notifications"
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">{t('notificationSettings.methods.push.label')}</Label>
                <p className="text-sm text-muted-foreground">{t('notificationSettings.methods.push.description')}</p>
              </div>
              <Switch
                id="push-notifications"
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t('notificationSettings.types.title')}</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="inventory-notifications">{t('notificationSettings.types.inventory.label')}</Label>
                <p className="text-sm text-muted-foreground">{t('notificationSettings.types.inventory.description')}</p>
              </div>
              <Switch
                id="inventory-notifications"
                checked={notifications.inventory}
                onCheckedChange={(checked) => setNotifications({ ...notifications, inventory: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="operations-notifications">{t('notificationSettings.types.operations.label')}</Label>
                <p className="text-sm text-muted-foreground">{t('notificationSettings.types.operations.description')}</p>
              </div>
              <Switch
                id="operations-notifications"
                checked={notifications.operations}
                onCheckedChange={(checked) => setNotifications({ ...notifications, operations: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="system-notifications">{t('notificationSettings.types.system.label')}</Label>
                <p className="text-sm text-muted-foreground">{t('notificationSettings.types.system.description')}</p>
              </div>
              <Switch
                id="system-notifications"
                checked={notifications.system}
                onCheckedChange={(checked) => setNotifications({ ...notifications, system: checked })}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? t('notificationSettings.buttons.saving') : t('notificationSettings.buttons.save')}
        </Button>
      </CardFooter>
    </Card>
  )
}

