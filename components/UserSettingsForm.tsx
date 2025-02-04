"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(8, {
      message: "Current password must be at least 8 characters.",
    }),
    newPassword: z.string().min(8, {
      message: "New password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Confirm password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

interface UserSettingsFormProps {
  user: {
    id: string
    name: string
    email: string
  }
}

export function UserSettingsForm({ user }: UserSettingsFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations("userSettings")

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  })

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/users/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to update user settings")
      }

      toast({
        title: t("toast.profileUpdated.title"),
        description: t("toast.profileUpdated.description"),
      })
      router.refresh()
    } catch (error) {
      toast({
        title: t("toast.error.title"),
        description: t("toast.error.profileUpdateFailed"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/users/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to change password")
      }

      toast({
        title: t("toast.passwordChanged.title"),
        description: t("toast.passwordChanged.description"),
      })
      passwordForm.reset()
    } catch (error) {
      toast({
        title: t("toast.error.title"),
        description: t("toast.error.passwordChangeFailed"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">{t("tabs.profile")}</TabsTrigger>
            <TabsTrigger value="password">{t("tabs.password")}</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("profile.name.label")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("profile.name.placeholder")} {...field} />
                      </FormControl>
                      <FormDescription>{t("profile.name.description")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("profile.email.label")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("profile.email.placeholder")} type="email" {...field} />
                      </FormControl>
                      <FormDescription>{t("profile.email.description")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? t("profile.updating") : t("profile.updateProfile")}
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="password">
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("password.currentPassword.label")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("password.currentPassword.placeholder")} type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("password.newPassword.label")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("password.newPassword.placeholder")} type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("password.confirmPassword.label")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("password.confirmPassword.placeholder")} type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? t("password.changingPassword") : t("password.changePassword")}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

