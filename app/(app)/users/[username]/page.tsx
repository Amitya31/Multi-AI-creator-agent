import CardList from "@/components/CardList";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { BadgeCheck } from "lucide-react";

const SingleUserpage = () =>{
    return (
        <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator/>
            <BreadcrumbItem>
              <BreadcrumbLink href="/users">User</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>John Doe</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="mt-4 flex flex-col xl:flex-row gap-8">
            <div className="w-full  xl:w-1/3 space-y-6">
              {/*USER BADGES CONTAINER */}
              <div className="bg-primary-foreground">
                <h1>User Badges</h1>
                <div className="flex gap-4 mt-4">
                    <HoverCard>
                        <HoverCardTrigger>
                            <BadgeCheck size={36} className="rounded-full p-2 bg-blue-500/30 border-1 border-blue-500/50"/>
                        </HoverCardTrigger>
                        <HoverCardContent>
                            <h1 className="font-bold mb-2">Verified User</h1>
                        </HoverCardContent>
                    </HoverCard>
                </div>
              </div>
              {/*INFORMATION CONTAINER */}
              <div className="bg-primary-foreground">Info</div>
              {/*CARD LIST CONTAINER */}
              <div className="bg-primary-foreground"><CardList title="Recent Transactions"/></div>
            </div>
            <div className="w-full xl:w-2/3 space-y-6">
              <div className="bg-primary-foreground p-4 rounded-lg">User Card</div>
              <div className="bg-primary-foreground p-4 rounded-lg">Chart</div>
            </div>

        </div>
        </div>
    )
}

export default SingleUserpage;