"use client"

import Link from "next/link";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarSeparator,
} from "./ui/sidebar";
import {
  LayoutDashboard, CreditCard, Settings, Plus,
  ListTodo, ChevronUp, FileText, Zap,
  Projector,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useEffect, useState } from "react";
import { fetchTasks } from "@/lib/api/tasks";
import { Task } from "@/lib/models/task";
import { getUser, logout } from "@/lib/api/auth";
import { useRouter } from "next/navigation"

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Tasks",     url: "/tasks",     icon: ListTodo },
  { title: "Billing",   url: "/billing",   icon: CreditCard },
  { title: "Agents" ,   url: "/agents",    icon: Projector},
  { title: "Settings",  url: "/settings",  icon: Settings },
]

const AppSidebar = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [user, setUser] = useState<any>(null)
  const router = useRouter();

  const handleLogout = async () => {
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
        const data = await fetchTasks()
        const user = await getUser()
        if (!mounted) return
        setTasks(data)
        setUser(user)
      } catch (err) {
        console.error(err)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <Sidebar collapsible="icon">

      {/* ── HEADER ── */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="/dashboard" className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <Zap className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-serif text-base tracking-tight text-foreground">
                    Content<em className="italic text-primary not-italic italic">Forge</em>
                  </span>
                  <span className="text-[10px] text-muted-foreground font-light tracking-wide">
                    AI Studio
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator className="ml-1"/>

      <SidebarContent>

        {/* ── MAIN NAV ── */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground/60">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center gap-2.5">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* ── RECENT TASKS ── */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground/60">
            Recent Tasks
          </SidebarGroupLabel>
          <SidebarGroupAction asChild title="New task">
            <Link href="/tasks">
              <Plus className="w-3.5 h-3.5" />
              <span className="sr-only">New task</span>
            </Link>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* See all */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/tasks" className="flex items-center gap-2.5 text-muted-foreground">
                    <ListTodo className="w-4 h-4" />
                    <span>All Tasks</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Task list */}
              {tasks.length > 0 && tasks.slice(0, 6).map((task) => (
                <SidebarMenuItem key={task.id}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={`/tasks/${task.id}`}
                      className="flex items-center gap-2.5"
                    >
                      <FileText className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />
                      <span className="truncate text-sm">
                        {task.name.length > 28
                          ? task.name.slice(0, 27) + "…"
                          : task.name}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* No tasks */}
              {tasks.length === 0 && (
                <SidebarMenuItem>
                  <span className="px-2 py-1.5 text-xs text-muted-foreground/50 font-light">
                    No tasks yet
                  </span>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      {/* ── FOOTER ── */}
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-10">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-semibold text-primary">{user?.name.slice(0,2).toUpperCase()}</span>
                  </div>
                  <div className="flex flex-col leading-none min-w-0">
                    <span className="text-sm font-medium text-foreground truncate">{user?.name}</span>
                    <span className="text-[11px] text-muted-foreground font-light truncate">{user?.email}</span>
                  </div>
                  <ChevronUp className="ml-auto w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="w-52">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="gap-2 text-sm cursor-pointer">
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="gap-2 text-sm cursor-pointer">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" className="text-sm" onClick={handleLogout}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

    </Sidebar>
  )
}

export default AppSidebar