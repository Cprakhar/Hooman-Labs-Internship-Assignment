import InsightsClient from "./insights"

export const dynamic = "force-static" // optional: export-friendly

export default function InsightsPage() {
  return <InsightsClient /> // ✅ default export present
}
