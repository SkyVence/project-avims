"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Globe } from "lucide-react"
import { useTranslations } from "next-intl"
import Cookies from "js-cookie"
import { locales } from "@/i18n/config"

export function LanguageSettings() {
  const router = useRouter()
  const [language, setLanguage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations()

  useEffect(() => {
    // Get the current locale from the cookie
    setLanguage(Cookies.get("NEXT_LOCALE") || "en")
  }, [])

  const languages = [
    { id: "en", name: "English", icon: "🇺🇸" },
    { id: "fr", name: "Français", icon: "🇫🇷" },
    // Only show languages configured in the i18n config
  ].filter(lang => locales.includes(lang.id as any))

  function onSubmit() {
    setIsLoading(true)

    try {
      // Set the NEXT_LOCALE cookie
      Cookies.set("NEXT_LOCALE", language, { expires: 365 })
      
      toast({
        title: t('languageSettings.toast.success.title', { defaultValue: 'Language Updated' }),
        description: t('languageSettings.toast.success.description', { defaultValue: 'Your language preferences have been updated.' }),
      })
      
      // Refresh the page to apply the new locale
      router.refresh()
    } catch (error) {
      toast({
        title: t('languageSettings.toast.error.title', { defaultValue: 'Error' }),
        description: t('languageSettings.toast.error.description', { defaultValue: 'Failed to update language preferences.' }),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('languageSettings.title', { defaultValue: 'Language' })}</CardTitle>
        <CardDescription>
          {t('languageSettings.description', { defaultValue: 'Choose your preferred language for the application interface.' })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <RadioGroup
            defaultValue={language}
            onValueChange={(value) => setLanguage(value)}
            className="grid grid-cols-2 gap-4"
          >
            {languages.map((lang) => (
              <div key={lang.id}>
                <RadioGroupItem value={lang.id} id={lang.id} className="peer sr-only" />
                <Label
                  htmlFor={lang.id}
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xl">{lang.icon}</span>
                    <Globe className="h-5 w-5" />
                  </div>
                  {lang.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? 
            t('languageSettings.buttons.saving', { defaultValue: 'Saving...' }) : 
            t('languageSettings.buttons.save', { defaultValue: 'Save Changes' })}
        </Button>
      </CardFooter>
    </Card>
  )
} 