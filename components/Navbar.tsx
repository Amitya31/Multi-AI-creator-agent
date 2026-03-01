"use client"

import { LogOut, Moon, Settings, Sun, User } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { useTheme } from "next-themes"
import { SidebarTrigger } from "./ui/sidebar"
import { useEffect, useState } from "react"
import { getUser, logout } from "@/lib/api/auth"
import { useRouter } from "next/navigation"

const Navbar = () => {
  const { setTheme, theme } = useTheme()
  const [user, setUser] = useState<any>(null)

  const router = useRouter();
  const handleLogout = async ()=>{
    try {
        await logout()
        router.push("/login")
        router.refresh()
    } catch (err) {
        console.error(err)
    }
  }

  useEffect(() => {
      let mounted = true
      async function load() {
        try {
          
          const user = await getUser()
          if (!mounted) return
          
          setUser(user)
        } catch (err) {
          console.error(err)
        }
      }
      load()
      return () => { mounted = false }
    }, [])

  return (
    <nav className="flex items-center justify-between px-4 h-16 border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-40">

      {/* Left */}
      <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* Theme toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-foreground">
              <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem
              onClick={() => setTheme("light")}
              className="gap-2 text-sm"
            >
              <Sun className="w-3.5 h-3.5" />
              Light
              {theme === "light" && <span className="ml-auto text-primary text-xs">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("dark")}
              className="gap-2 text-sm"
            >
              <Moon className="w-3.5 h-3.5" />
              Dark
              {theme === "dark" && <span className="ml-auto text-primary text-xs">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("system")}
              className="gap-2 text-sm"
            >
              <span className="w-3.5 h-3.5 flex items-center justify-center text-[10px]">⊙</span>
              System
              {theme === "system" && <span className="ml-auto text-primary text-xs">✓</span>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Divider */}
        <div className="w-px h-5 bg-border mx-1" />

        {/* User avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full ring-2 ring-transparent hover:ring-border transition-all focus-visible:outline-none focus-visible:ring-ring">
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                  CN
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" sideOffset={10} className="w-52">
            <DropdownMenuLabel className="font-normal py-2">
              <p className="text-xs font-semibold text-foreground">My Account</p>
              <p className="text-[11px] text-muted-foreground font-light mt-0.5">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="gap-2 cursor-pointer text-sm">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="gap-2 cursor-pointer text-sm">
                <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" className="gap-2 text-sm" onClick={handleLogout}>
              <LogOut className="w-3.5 h-3.5" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </nav>
  )
}

export default Navbar