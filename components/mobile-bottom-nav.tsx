"use client"

import { Home, Search, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MobileBottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="grid grid-cols-4 gap-1 p-2">
        <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-2">
          <Home className="h-5 w-5" />
          <span className="text-xs">Home</span>
        </Button>

        <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-2">
          <Search className="h-5 w-5" />
          <span className="text-xs">Search</span>
        </Button>

        <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-2">
          <Calendar className="h-5 w-5" />
          <span className="text-xs">Bookings</span>
        </Button>

        <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-2">
          <User className="h-5 w-5" />
          <span className="text-xs">Profile</span>
        </Button>
      </div>
    </div>
  )
}
