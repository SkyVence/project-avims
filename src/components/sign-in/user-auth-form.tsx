"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useSignIn, useSignUp } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Icons } from "@/components/icons"
import { handleError } from "@/lib/error-handler"
import { useTranslations } from "next-intl"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  isSignUp?: boolean
}

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
})

export function UserAuthForm({ isSignUp = false, ...props }: UserAuthFormProps) {
  const router = useRouter()
  const { isLoaded: isSignInLoaded, signIn, setActive } = useSignIn()
  const { isLoaded: isSignUpLoaded, signUp } = useSignUp()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)
  const t = useTranslations()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        if (!isSignUpLoaded) return

        const result = await signUp.create({
          emailAddress: values.email,
          password: values.password,
        })

        if (result.status === "complete") {
          if (setActive) {
            await setActive({ session: result.createdSessionId })
          }
          router.push("/")
        } else {
          // Handle additional sign-up steps if needed
          console.log(result)
        }
      } else {
        if (!isSignInLoaded) return

        const result = await signIn.create({
          identifier: values.email,
          password: values.password,
        })

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId })
          router.push("/")
        } else {
          console.log(result)
        }
      }
    } catch (error) {
      handleError(error, {
        title: isSignUp ? t('auth.signup.error.title') : t('auth.signin.error.title'),
        defaultMessage: t('auth.common.error.message')
      })
      if (error instanceof Error) {
        setError(error.message || t('auth.common.error.message'))
      } else {
        setError(t('auth.common.error.message'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6" {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.common.fields.email.label')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('auth.common.fields.email.placeholder')}
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
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
                <FormLabel>{t('auth.common.fields.password.label')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('auth.common.fields.password.placeholder')}
                    type="password"
                    autoCapitalize="none"
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div id="clerk-captcha"/>
          {error && <div className="text-sm text-destructive">{error}</div>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {isSignUp ? t('auth.signup.buttons.submit') : t('auth.signin.buttons.submit')}
          </Button>
        </form>
      </Form>
    </div>
  )
}

