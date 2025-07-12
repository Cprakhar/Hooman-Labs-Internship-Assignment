import { Card, CardContent, CardHeader, CardTitle } from "@/components/card"

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: "up" | "down" | "neutral"
  className?: string
}

export function KPICard({ title, value, subtitle, trend, className }: KPICardProps) {
  const trendColor = trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600"

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className={`text-xs ${trendColor}`}>{subtitle}</p>}
      </CardContent>
    </Card>
  )
}
