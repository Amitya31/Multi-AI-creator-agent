import Link from "next/link";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "./ui/sidebar"
import { Calendar, ChevronUp, Home, Inbox, Plus, Projector, Search, Settings, User2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

const items = [
    {
        title:"Home",
        url:"/",    
        icon: Home
    },
    {
        title:"Inbox",
        url:"#",
        icon: Inbox
    },
    {
        title:"Calendar",
        url:"#",
        icon: Calendar
    },
    {
        title:"Search",
        url:"#",
        icon: Search
    },
    {
        title:"Settings",
        url:"/",
        icon: Settings
    }


]
const AppSidebar = ()=>{
    return <Sidebar collapsible="icon" >
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href='/'>
                          AMIT DEV
                         </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
        <SidebarSeparator/>
        <SidebarContent>
            <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item)=>(
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                                <Link href={item.url}>
                                   <item.icon />
                                   <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
                <SidebarGroupLabel>Projects</SidebarGroupLabel>
                <SidebarGroupAction>
                  <Plus/> <span className="sr-only">Add Projects</span>
                </SidebarGroupAction>
                <SidebarGroupContent>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/#">
                               <Projector />
                               See All Projects
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/#">
                               <Plus />
                               Add Project
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
                <SidebarGroupLabel>Collapsible</SidebarGroupLabel>
                
                <SidebarGroupContent>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/#">
                               <Projector />
                               See All Projects
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/#">
                               <Plus />
                               Add Project
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton >
                                <User2 /> John Doe <ChevronUp className="ml-auto"/>
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Account</DropdownMenuItem>
                            <DropdownMenuItem>Setting</DropdownMenuItem>
                            <DropdownMenuItem>Sign out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </Sidebar>;
}
export default AppSidebar