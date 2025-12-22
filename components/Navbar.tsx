"use client"

import { LogOutIcon, Moon, Settings, SquareMenu, Sun, User } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { DropdownMenuContent, DropdownMenu, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { useTheme } from "next-themes"
import { SidebarTrigger } from "./ui/sidebar"

const Navbar = ()=>{
    const { theme,setTheme } = useTheme()
    return (
        <nav className="p-4 flex items-center justify-between">
            <SidebarTrigger/>
            <div className="flex items-center gap-4">
            <Link href="/">DashBoard</Link>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                System
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
            
                        <DropdownMenuContent sideOffset={10}> {/* sideOffset is the */}
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem>
                                <User className="w-[1.2rem] h-[1.2rem] mr-2"/>
                                Profile   
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="w-[1.2rem] h-[1.2rem] mr-2"/> 
                                Setting
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive">
                                <LogOutIcon className="w-[1.2rem] h-[1.2rem] mr-2"/> Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <SquareMenu />
                        <span className="sr-only">Open Menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                <DropdownMenuItem>Menu Item 1</DropdownMenuItem>
                <DropdownMenuItem>Menu Item 2</DropdownMenuItem>
                <DropdownMenuItem>Menu Item 3</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            </div>
        </nav>
    )
}

export default Navbar