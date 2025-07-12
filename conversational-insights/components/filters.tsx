"use client"

import { observer } from "mobx-react-lite"
import { useStore } from "@/lib/store/store-provider"
import { Button } from "@/components/button"
import { Input } from "@/components/input"
import { Label } from "@/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card"

export const Filters = observer(() => {
  const store = useStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Agent Filter */}
          <div className="space-y-2">
            <Label htmlFor="agent">Agent</Label>
            <Select
              value={store.filters.agent ?? "allAgents"}
              onValueChange={(value) => store.setAgent(value === "allAgents" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All agents" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="allAgents">All agents</SelectItem>
                {store.uniqueAgents.map((agent) => (
                  <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Call Type Filter */}
          <div className="space-y-2">
            <Label htmlFor="callType">Call Type</Label>
            <Select
              value={store.filters.callType ?? "allTypes"}
              onValueChange={(value) =>
                store.setCallType(value === "allTypes" ? undefined : (value as "inbound" | "outbound"))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="allTypes">All types</SelectItem>
                <SelectItem value="inbound">Inbound</SelectItem>
                <SelectItem value="outbound">Outbound</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={store.filters.status ?? "allStatuses"}
              onValueChange={(value) => store.setStatus(value === "allStatuses" ? undefined : (value as any))}
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="allStatuses">All statuses</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="no_answer">No Answer</SelectItem>
                <SelectItem value="dropped">Dropped</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Duration Range */}
          <div className="space-y-2">
            <Label>Duration Range (seconds)</Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder={`Min (${store.minDuration})`}
                value={store.filters.durationRange.min || ""}
                onChange={(e) =>
                  store.setDurationRange(
                    e.target.value ? Number(e.target.value) : undefined,
                    store.filters.durationRange.max,
                  )
                }
                min={store.minDuration}
                max={store.maxDuration}
              />
              <Input
                type="number"
                placeholder={`Max (${store.maxDuration})`}
                value={store.filters.durationRange.max || ""}
                onChange={(e) =>
                  store.setDurationRange(
                    store.filters.durationRange.min,
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                min={store.minDuration}
                max={store.maxDuration}
              />
            </div>
          </div>

          {/* Cost Range */}
          <div className="space-y-2">
            <Label>Cost Range ($)</Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                step="0.01"
                placeholder={`Min (${store.minCost})`}
                value={store.filters.costRange.min || ""}
                onChange={(e) =>
                  store.setCostRange(e.target.value ? Number(e.target.value) : undefined, store.filters.costRange.max)
                }
                min={store.minCost}
                max={store.maxCost}
              />
              <Input
                type="number"
                step="0.01"
                placeholder={`Max (${store.maxCost})`}
                value={store.filters.costRange.max || ""}
                onChange={(e) =>
                  store.setCostRange(store.filters.costRange.min, e.target.value ? Number(e.target.value) : undefined)
                }
                min={store.minCost}
                max={store.maxCost}
              />
            </div>
          </div>
        </div>

        <Button onClick={() => store.clearFilters()} variant="outline">
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  )
})
