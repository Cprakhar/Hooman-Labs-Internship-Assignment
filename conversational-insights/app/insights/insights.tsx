"use client"

import { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { useStore } from "@/lib/store/store-provider"
import { KPICard } from "@/components/kpi-card"
import { Filters } from "@/components/filters"
import { StatusBreakdownChart, AgentPerformanceChart, CallTypeChart, AverageCallDurationChart } from "@/components/charts"
import { Loader2 } from "lucide-react"

const InsightsClient = observer(() => {
  const store = useStore()

  useEffect(() => {
    store.loadConversations()
  }, [store])

  if (store.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Conversation Insights</h1>
        <div className="text-sm text-muted-foreground">
          Showing {store.filteredConversations.length} of {store.conversations.length} conversations
        </div>
      </div>

      {/* Filters */}
      <Filters />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Calls" value={store.totalCalls} subtitle={`${store.conversations.length} total`} />
        <KPICard title="Success Rate" value={`${store.successRate.toFixed(1)}%`} subtitle="Successful calls" />
        <KPICard
          title="Avg Call Duration"
          value={`${Math.round(store.averageCallDuration)}s`}
          subtitle="Average duration"
        />
        <KPICard title="Total Cost" value={`$${store.totalCost.toFixed(2)}`} subtitle="Total spend" />
      </div>

      {/* Second row of KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Avg LLM Latency" value={`${Math.round(store.averageLLMLatency)}ms`} subtitle="Response time" />
        <KPICard
          title="Avg TTS Latency"
          value={`${Math.round(store.averageTTSLatency)}ms`}
          subtitle="Speech synthesis"
        />
        <KPICard title="Total Interruptions" value={store.totalInterruptions} subtitle="User interruptions" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusBreakdownChart />
        <AverageCallDurationChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgentPerformanceChart />
        <CallTypeChart />
      </div>
    </div>
  )
})

export default InsightsClient