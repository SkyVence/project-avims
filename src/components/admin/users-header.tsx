"use client"

import { Button } from "../ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { InviteUserDialog } from "./invite-user-dialog"

export function UsersHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Manage users in the inventory management system</p>
      </div>
      <Button onClick={() => setIsDialogOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Invite User
      </Button>
      <InviteUserDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  )
}

