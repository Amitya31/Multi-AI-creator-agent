"use client"

import useSWR from "swr"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then(r => r.json())

const statusStyles: Record<string, string> = {
  completed: "bg-green-500/10 text-green-600 border-green-500/20",
  pending:   "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  failed:    "bg-destructive/10 text-destructive border-destructive/20",
}

export default function BillingHistory() {
  const { data } = useSWR("/api/billing/history", fetcher)

  if (!data) {
    return <div className="h-40 bg-muted animate-pulse rounded-2xl" />
  }

  if (!Array.isArray(data)) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
        Failed to load billing history.
      </div>
    )
  }

  return (
    <div className="border border-border rounded-2xl bg-card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-0.5">
          Transactions
        </p>
        <h2 className="font-serif text-xl tracking-tight text-foreground">Payment History</h2>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <p className="text-sm font-medium text-muted-foreground">No transactions yet</p>
          <p className="text-xs text-muted-foreground/60 mt-1 font-light">Your payment history will appear here</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">Date</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">Credits</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">Amount</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((tx: any) => (
              <TableRow key={tx.id} className="hover:bg-muted/40 transition-colors">
                <TableCell className="text-sm text-foreground">
                  {new Date(tx.createdAt).toLocaleDateString(undefined, {
                    month: "short", day: "numeric", year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-sm font-medium text-foreground">
                  +{tx.creditsAdded.toLocaleString()}
                </TableCell>
                <TableCell className="text-sm text-foreground">
                  ${(tx.amount / 100).toFixed(2)}
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded border",
                    statusStyles[tx.status] ?? "bg-muted text-muted-foreground border-border"
                  )}>
                    {tx.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}