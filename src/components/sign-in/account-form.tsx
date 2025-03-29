"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useUser } from "@clerk/nextjs"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Icons } from "../icons"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

const profileFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// Define a type for our serialized user data
interface UserData {
  id: string
  firstName: string | null
  lastName: string | null
  imageUrl: string
  emailAddresses: {
    id: string
    emailAddress: string
    isPrimary: boolean
  }[]
  externalAccounts: {
    id: string
    provider: string
  }[]
}

interface AccountFormProps {
  userData: UserData
}

export function AccountForm({ userData }: AccountFormProps) {
  const { user: clerkUser, isLoaded } = useUser()
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  // Find primary email
  const primaryEmail = userData.emailAddresses.find((email) => email.isPrimary)?.emailAddress || ""

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      email: primaryEmail,
    },
  })

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)

    try {
      if (!isLoaded || !clerkUser) return

      await clerkUser.update({
        firstName: data.firstName,
        lastName: data.lastName,
      })

      // Handle email update if needed
      const primaryEmailId = clerkUser.primaryEmailAddressId
      const currentEmail = clerkUser.emailAddresses.find((email) => email.id === primaryEmailId)

      if (currentEmail?.emailAddress !== data.email) {
        // This would typically require email verification
        console.log("Email update would require verification")
      }

      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Manage your public profile information.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userData.imageUrl} alt={userData.firstName || "User"} />
                <AvatarFallback>{userData.firstName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm">
                  Change avatar
                </Button>
              </div>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Changing your email will require verification.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                  Update profile
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="account" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings and connected services.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Connected accounts</h3>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center space-x-3">
                  <Icons.discord className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Discord</p>
                    <p className="text-sm text-muted-foreground">
                      {userData.externalAccounts.some((account) => account.provider === "discord")
                        ? "Connected"
                        : "Not connected"}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {userData.externalAccounts.some((account) => account.provider === "discord")
                    ? "Disconnect"
                    : "Connect"}
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center space-x-3">
                  <Icons.google className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Google</p>
                    <p className="text-sm text-muted-foreground">
                      {userData.externalAccounts.some((account) => account.provider === "google")
                        ? "Connected"
                        : "Not connected"}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {userData.externalAccounts.some((account) => account.provider === "google")
                    ? "Disconnect"
                    : "Connect"}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="destructive" className="w-full">
              Delete account
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

