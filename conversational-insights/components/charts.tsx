"use client"

import { observer } from "mobx-react-lite"
import { useStore } from "@/lib/store/store-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export const AverageCallDurationChart = observer(() => {
  const store = useStore();
  // If agent or callType filter is set, group accordingly
  const { agent, callType } = store.filters;
  let data: any[] = [];

  if (agent && !callType) {
    // Group by call type for selected agent
    const grouped: Record<string, { type: string; total: number; count: number }> = {};
    store.filteredConversations.forEach((conv) => {
      if (conv.agent !== agent) return;
      const type = conv.callInfo.type;
      if (!grouped[type]) grouped[type] = { type, total: 0, count: 0 };
      grouped[type].total += conv.duration;
      grouped[type].count += 1;
    });
    data = Object.values(grouped).map((g) => ({
      type: g.type,
      avgDuration: g.count ? g.total / g.count : 0,
    }));
  } else if (!agent && callType) {
    // Group by agent for selected call type
    const grouped: Record<string, { agent: string; total: number; count: number }> = {};
    store.filteredConversations.forEach((conv) => {
      if (conv.callInfo.type !== callType) return;
      const agentKey = conv.agent;
      if (!grouped[agentKey]) grouped[agentKey] = { agent: agentKey, total: 0, count: 0 };
      grouped[agentKey].total += conv.duration;
      grouped[agentKey].count += 1;
    });
    data = Object.values(grouped).map((g) => ({
      agent: g.agent,
      avgDuration: g.count ? g.total / g.count : 0,
    }));
  } else if (agent && callType) {
    // Only one bar: selected agent and call type
    const filtered = store.filteredConversations.filter(
      (conv) => conv.agent === agent && conv.callInfo.type === callType
    );
    const total = filtered.reduce((sum, conv) => sum + conv.duration, 0);
    const count = filtered.length;
    data = [
      {
        label: `${agent} (${callType})`,
        avgDuration: count ? total / count : 0,
      },
    ];
  } else {
    // Group by agent and call type (stacked/grouped bar)
    const grouped: Record<string, { agent: string; [key: string]: any }> = {};
    store.filteredConversations.forEach((conv) => {
      const agentKey = conv.agent;
      const type = conv.callInfo.type;
      if (!grouped[agentKey]) grouped[agentKey] = { agent: agentKey };
      if (!grouped[agentKey][type]) grouped[agentKey][type] = { total: 0, count: 0 };
      grouped[agentKey][type].total += conv.duration;
      grouped[agentKey][type].count += 1;
    });
    data = Object.values(grouped).map((g) => {
      const inbound = g.inbound ? g.inbound.total / g.inbound.count : 0;
      const outbound = g.outbound ? g.outbound.total / g.outbound.count : 0;
      return { agent: g.agent, inbound, outbound };
    });
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Average Call Duration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">No data available</div>
        </CardContent>
      </Card>
    );
  }

  // Render chart based on grouping
  let bars;
  if (agent && !callType) {
    // By call type for selected agent
    bars = [<Bar key="avgDuration" dataKey="avgDuration" name="Avg Duration" fill={COLORS[0]} />];
    return (
      <Card>
        <CardHeader>
          <CardTitle>Average Call Duration by Call Type ({agent})</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis label={{ value: 'Seconds', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value: number) => value.toFixed(2) + ' s'} />
              {bars}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  } else if (!agent && callType) {
    // By agent for selected call type
    bars = [<Bar key={callType} dataKey="avgDuration" name={callType} fill={COLORS[0]} />];
    return (
      <Card>
        <CardHeader>
          <CardTitle>Average Call Duration by Agent ({callType})</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="agent" />
              <YAxis label={{ value: 'Seconds', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value: number) => value.toFixed(2) + ' s'} />
              {bars}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  } else if (agent && callType) {
    // Only one bar
    bars = [<Bar key="avgDuration" dataKey="avgDuration" name="Avg Duration" fill={COLORS[0]} />];
    return (
      <Card>
        <CardHeader>
          <CardTitle>Average Call Duration ({agent}, {callType})</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis label={{ value: 'Seconds', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value: number) => value.toFixed(2) + ' s'} />
              {bars}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  } else {
    // Grouped by agent, bars for inbound/outbound
    bars = [
      <Bar key="inbound" dataKey="inbound" name="Inbound" fill={COLORS[0]} />,
      <Bar key="outbound" dataKey="outbound" name="Outbound" fill={COLORS[1]} />,
    ];
    return (
      <Card>
        <CardHeader>
          <CardTitle>Average Call Duration by Agent and Type</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="agent" />
              <YAxis label={{ value: 'Seconds', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value: number) => value.toFixed(2) + ' s'} />
              {bars}
            </BarChart>
          </ResponsiveContainer>
          <div className="text-xs text-muted-foreground mt-2">Bar color: Inbound/Outbound. Filter to see by agent or type.</div>
        </CardContent>
      </Card>
    );
  }
});

export const StatusBreakdownChart = observer(() => {
  const store = useStore()
  const data = store.statusBreakdown.filter((item) => item.count > 0)

  console.log("StatusBreakdown data:", data) // Add this line

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Call Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">No data available</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Call Status Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ status, count }) => `${status}: ${count}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
})

export const AgentPerformanceChart = observer(() => {
  const store = useStore()
  const data = store.agentBreakdown

  console.log("AgentPerformance data:", data)

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Calls by Agent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">No data available</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calls by Agent</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="agent" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
})

export const CallTypeChart = observer(() => {
  const store = useStore()
  const data = store.callTypeBreakdown.filter((item) => item.count > 0)

  console.log("CallType data:", data)

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inbound vs Outbound</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">No data available</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inbound vs Outbound</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ type, count }) => `${type}: ${count}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
})