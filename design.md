# Conversation Insights Design

## 1. Top 7 Metrics
1. **Total Calls**: Total number of conversations.
2. **Success Rate**: Percentage of calls with status 'success'.
3. **Average Call Duration**: Mean duration of all calls.
4. **Total Cost**: Sum of call costs.
5. **Average LLM Latency**: Mean of `llmLatency` across calls.
6. **Average TTS Latency**: Mean of `ttsLatency` across calls.
7. **Number of Interruptions**: Total or average interruptions per call.

## 2. Proposed Filters
- Date/Time Range (by `startTime`)
- Agent
- Call Type (inbound/outbound)
- Call Status
- Caller/Callee
- Duration Range
- Cost Range

## 3. Visualization Plan
| Metric                   | Visualization (by filter)                                  |
|-------------------------|------------------------------------------------------------|
| Total Calls             | KPI card, time series chart (if filtered by date)          |
| Success Rate            | KPI card, pie chart (status breakdown)                     |
| Average Call Duration   | KPI card, bar chart (by agent/type)                        |
| Total Cost              | KPI card, line chart (over time)                           |
| Avg. LLM Latency        | KPI card, bar chart (by agent/type)                        |
| Avg. TTS Latency        | KPI card, bar chart (by agent/type)                        |
| Number of Interruptions | KPI card, table (top interrupted calls)                    |

## 4. Additional Ideas
- Allow export of filtered data (CSV)
- Drill-down: click a metric to see detailed call list
- Highlight anomalies (e.g., high latency, high interruptions)
- Tooltips with definitions for each metric
