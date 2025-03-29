"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@clerk/nextjs"
import { updateProfile } from "@/app/actions/user"
import { useTranslations } from "next-intl"

const profileFormSchema = (t: any) => z.object({
  username: z.string().min(2, {
    message: t('profileSettings.username.error'),
  }),
  bio: z.string().max(160).optional(),
})

type ProfileFormValues = z.infer<ReturnType<typeof profileFormSchema>>

interface ProfileSettingsProps {
  user: any
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const router = useRouter()
  const { user: clerkUser } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema(t)),
    defaultValues: {
      username: user.username || "",
      bio: user.bio || "",
    },
    mode: "onChange",
  })

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)

    try {
      if (!clerkUser) {
        throw new Error("No user found")
      }

      // Update username in Clerk
      await clerkUser.update({
        username: data.username,
      })

      // Update profile in database
      await updateProfile({
        username: data.username,
        bio: data.bio,
      })

      toast({
        title: t('profileSettings.toast.success.title'),
        description: t('profileSettings.toast.success.description'),
      })
      router.refresh()
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: t('profileSettings.toast.error.title'),
        description: t('profileSettings.toast.error.description'),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profileSettings.title')}</CardTitle>
        <CardDescription>{t('profileSettings.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={clerkUser?.imageUrl} alt={user.username || t('navigation.profile')} />
            <AvatarFallback>{user.username?.charAt(0) || user.email.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">{user.username || t('navigation.profile')}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('profileSettings.username.label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('profileSettings.username.placeholder')} {...field} />
                  </FormControl>
                  <FormDescription>{t('profileSettings.username.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('profileSettings.bio.label')}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t('profileSettings.bio.placeholder')} 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>{t('profileSettings.bio.description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading ? t('profileSettings.buttons.saving') : t('profileSettings.buttons.save')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

