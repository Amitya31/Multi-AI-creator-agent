// import AppAreaChart from "@/components/AppAreaChart";
// import AppBarChart from "@/components/AppBarChart";
// import AppPieChart from "@/components/AppPieChart";
// import CardList from "@/components/CardList";
// import TodoList from "@/components/TodoList";
// import { Button } from "@/components/ui/button";
// import {CirclePlus} from "lucide-react"

// export default function Home() {
//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3  gap-4">
//       <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
//         <AppBarChart/>
//       </div>
//       <div className="bg-primary-foreground p-4 rounded-lg">
//         <CardList title="Latest Transactions"/>
//       </div>
//       <div className="bg-primary-foreground p-4 rounded-lg">
//         <AppPieChart/>
//       </div>
//       <div className="bg-primary-foreground p-4 rounded-lg">
//         <TodoList/>
//       </div>
//       <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
//         <AppAreaChart/>
//       </div>
//       <div className="bg-primary-foreground p-4 rounded-lg">
//         <CardList title="Popular Content"/>
//       </div>
//     </div>
//   )
// };

import OverviewCards from "@/components/dashboard/OverviewCards"
import AgentUsageBar from "@/components/dashboard/AgentUsageBar"
import TokenAreaChart from "@/components/dashboard/TokenAreaChart"
import RecentTasks from "@/components/dashboard/RecentTasks"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect('/login');
  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Page header */}
      <div>
        <p className="text-[10px] font-semibold tracking-widest uppercase text-primary mb-1">
          Overview
        </p>
        <h1 className="font-serif text-3xl tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground font-light mt-1">
          Your content generation activity at a glance.
        </p>
      </div>

      <OverviewCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TokenAreaChart />
        <AgentUsageBar />
      </div>

      <RecentTasks />
    </div>
  )
}
