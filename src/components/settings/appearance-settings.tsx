"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { toast } from "@/hooks/use-toast"
import { Moon, Sun, Laptop } from "lucide-react"
import { useTranslations } from "next-intl"

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations()

  function onSubmit() {
    setIsLoading(true)

    try {
      toast({
        title: t('appearanceSettings.toast.success.title'),
        description: t('appearanceSettings.toast.success.description'),
      })
    } catch (error) {
      toast({
        title: t('appearanceSettings.toast.error.title'),
        description: t('appearanceSettings.toast.error.description'),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('appearanceSettings.title')}</CardTitle>
        <CardDescription>
          {t('appearanceSettings.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <RadioGroup
            defaultValue={theme}
            onValueChange={(value) => setTheme(value)}
            className="grid grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem value="light" id="light" className="peer sr-only" />
              <Label
                htmlFor="light"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Sun className="mb-3 h-6 w-6" />
                {t('appearanceSettings.themes.light')}
              </Label>
            </div>

            <div>
              <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
              <Label
                htmlFor="dark"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Moon className="mb-3 h-6 w-6" />
                {t('appearanceSettings.themes.dark')}
              </Label>
            </div>

            <div>
              <RadioGroupItem value="system" id="system" className="peer sr-only" />
              <Label
                htmlFor="system"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Laptop className="mb-3 h-6 w-6" />
                {t('appearanceSettings.themes.system')}
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? t('appearanceSettings.buttons.saving') : t('appearanceSettings.buttons.save')}
        </Button>
      </CardFooter>
    </Card>
  )
}

