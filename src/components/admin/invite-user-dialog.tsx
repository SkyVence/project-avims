"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { toast } from "@/hooks/use-toast"
import { inviteUser } from "../../app/actions/admin"
import { useTranslations } from "next-intl"

const inviteFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

type InviteFormValues = z.infer<typeof inviteFormSchema>

interface InviteUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InviteUserDialog({ open, onOpenChange }: InviteUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations()

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: InviteFormValues) => {
    try {
      setIsLoading(true)
      await inviteUser(data.email)
      toast({
        title: t('admin.users.inviteDialog.toast.success.title'),
        description: t('admin.users.inviteDialog.toast.success.description'),
      })
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error(error)
      toast({
        title: t('admin.users.inviteDialog.toast.error.title'),
        description: t('admin.users.inviteDialog.toast.error.description'),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('admin.users.inviteDialog.title')}</DialogTitle>
          <DialogDescription>{t('admin.users.inviteDialog.description')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('admin.users.inviteDialog.fields.email.label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('admin.users.inviteDialog.fields.email.placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                {t('admin.users.inviteDialog.buttons.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t('admin.users.inviteDialog.buttons.sending') : t('admin.users.inviteDialog.buttons.send')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

