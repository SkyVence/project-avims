"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSignUp } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "../ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from "next-intl"

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  username: z.string().min(4, {
    message: "Username must be at least 4 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

type FormValues = z.infer<typeof formSchema>

export function SignUpForm({ invitationToken }: { invitationToken: string }) {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const t = useTranslations()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
    },
  })

  async function onSubmit(data: FormValues) {
    if (!isLoaded) return

    try {
      setIsLoading(true)

      // Create the sign-up with the ticket strategy
      const result = await signUp.create({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        password: data.password,
        strategy: "ticket",
        ticket: invitationToken,
      })

      if (result.status === "complete") {
        // Set the user as active
        await setActive({ session: result.createdSessionId })
        router.push(process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || "/")
      } else {
        toast({
          title: t('auth.signup.toast.error.title'),
          description: t('auth.signup.toast.error.description'),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error during sign-up:", error)
      toast({
        title: t('auth.signup.toast.error.title'),
        description: t('auth.signup.toast.error.description'),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.signup.fields.firstName.label')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('auth.signup.fields.firstName.placeholder')} {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.signup.fields.lastName.label')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('auth.signup.fields.lastName.placeholder')} {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.signup.fields.username.label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('auth.signup.fields.username.placeholder')} {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.signup.fields.password.label')}</FormLabel>
              <FormControl>
                <Input type="password" placeholder={t('auth.signup.fields.password.placeholder')} {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div id="clerk-captcha" className="my-4"></div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t('auth.signup.buttons.creating') : t('auth.signup.buttons.createAccount')}
        </Button>
      </form>
    </Form>
  )
}

