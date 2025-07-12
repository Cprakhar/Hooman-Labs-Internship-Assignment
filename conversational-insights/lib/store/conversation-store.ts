import { types, flow } from "mobx-state-tree"

// Call stats model
const CallStats = types.model("CallStats", {
  llmLatency: types.number,
  ttsLatency: types.number,
  interruptions: types.number,
})

// Call info model
const CallInfo = types.model("CallInfo", {
  caller: types.string,
  callee: types.string,
  type: types.enumeration(["inbound", "outbound"]),
  stats: types.maybe(CallStats),
})

// Conversation model
const Conversation = types.model("Conversation", {
  id: types.string,
  agent: types.string,
  startTime: types.number,
  duration: types.number,
  cost: types.number,
  status: types.enumeration(["busy", "success", "transfer", "no_answer", "dropped"]),
  callInfo: CallInfo,
})

// Filters model
const Filters = types.model("Filters", {
  dateRange: types.optional(
    types.model({
      start: types.maybe(types.number),
      end: types.maybe(types.number),
    }),
    {},
  ),
  agent: types.maybe(types.string),
  callType: types.maybe(types.enumeration(["inbound", "outbound"])),
  status: types.maybe(types.enumeration(["busy", "success", "transfer", "no_answer", "dropped"])),
  durationRange: types.optional(
    types.model({
      min: types.maybe(types.number),
      max: types.maybe(types.number),
    }),
    {},
  ),
  costRange: types.optional(
    types.model({
      min: types.maybe(types.number),
      max: types.maybe(types.number),
    }),
    {},
  ),
})

// Root store
const ConversationStore = types
  .model("ConversationStore", {
    conversations: types.array(Conversation),
    filters: types.optional(Filters, {}),
    loading: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    loadConversations: flow(function* () {
      self.loading = true
      try {
        const response = yield fetch("/api/conversations")
        const data = yield response.json()
        self.conversations.replace(data)
      } catch (error) {
        console.error("Failed to load conversations:", error)
      } finally {
        self.loading = false
      }
    }),

    setDateRange(start?: number, end?: number) {
      self.filters.dateRange.start = start
      self.filters.dateRange.end = end
    },

    setAgent(agent?: string) {
      self.filters.agent = agent
    },

    setCallType(type?: "inbound" | "outbound") {
      self.filters.callType = type
    },

    setStatus(status?: "busy" | "success" | "transfer" | "no_answer" | "dropped") {
      self.filters.status = status
    },

    setDurationRange(min?: number, max?: number) {
      self.filters.durationRange.min = min
      self.filters.durationRange.max = max
    },

    setCostRange(min?: number, max?: number) {
      self.filters.costRange.min = min
      self.filters.costRange.max = max
    },

    clearFilters() {
      self.filters = Filters.create({})
    },
  }))
  .views((self) => ({
    // Min and max duration for dynamic filter placeholders
    get minDuration() {
      if (self.conversations.length === 0) return 0;
      return Math.min(...self.conversations.map((conv) => conv.duration));
    },
    get maxDuration() {
      if (self.conversations.length === 0) return 0;
      return Math.max(...self.conversations.map((conv) => conv.duration));
    },
    // Min and max cost for dynamic filter placeholders
    get minCost() {
      if (self.conversations.length == 0) return 0;
      return Math.min(...self.conversations.map((conv) => conv.cost));
    },
    get maxCost() {
      if (self.conversations.length == 0) return 0;
      return Math.max(...self.conversations.map((conv) => conv.cost));
    },
    // Unique agents for dynamic filter dropdown
    get uniqueAgents() {
      const agents = new Set<string>();
      self.conversations.forEach((conv) => {
        if (conv.agent) agents.add(conv.agent);
      });
      return Array.from(agents);
    },

    get filteredConversations() {
      return self.conversations.filter((conv) => {
        // Date range filter
        if (self.filters.dateRange.start && conv.startTime < self.filters.dateRange.start) return false
        if (self.filters.dateRange.end && conv.startTime > self.filters.dateRange.end) return false

        // Agent filter
        if (self.filters.agent && conv.agent !== self.filters.agent) return false

        // Call type filter
        if (self.filters.callType && conv.callInfo.type !== self.filters.callType) return false

        // Status filter
        if (self.filters.status && conv.status !== self.filters.status) return false

        // Duration range filter
        if (self.filters.durationRange.min && conv.duration < self.filters.durationRange.min) return false
        if (self.filters.durationRange.max && conv.duration > self.filters.durationRange.max) return false

        // Cost range filter
        if (self.filters.costRange.min && conv.cost < self.filters.costRange.min) return false
        if (self.filters.costRange.max && conv.cost > self.filters.costRange.max) return false

        return true
      })
    },

    // Metric 1: Total Calls
    get totalCalls() {
      return this.filteredConversations.length
    },

    // Metric 2: Success Rate
    get successRate() {
      const total = this.filteredConversations.length
      if (total === 0) return 0
      const successful = this.filteredConversations.filter((conv) => conv.status === "success").length
      return (successful / total) * 100
    },

    // Metric 3: Average Call Duration
    get averageCallDuration() {
      const conversations = this.filteredConversations
      if (conversations.length === 0) return 0
      const totalDuration = conversations.reduce((sum, conv) => sum + conv.duration, 0)
      return totalDuration / conversations.length
    },

    // Metric 4: Total Cost
    get totalCost() {
      return this.filteredConversations.reduce((sum, conv) => sum + conv.cost, 0)
    },

    // Metric 5: Average LLM Latency
    get averageLLMLatency() {
      const conversationsWithStats = this.filteredConversations.filter((conv) => conv.callInfo.stats)
      if (conversationsWithStats.length === 0) return 0
      const totalLatency = conversationsWithStats.reduce((sum, conv) => sum + (conv.callInfo.stats?.llmLatency || 0), 0)
      return totalLatency / conversationsWithStats.length
    },

    // Metric 6: Average TTS Latency
    get averageTTSLatency() {
      const conversationsWithStats = this.filteredConversations.filter((conv) => conv.callInfo.stats)
      if (conversationsWithStats.length === 0) return 0
      const totalLatency = conversationsWithStats.reduce((sum, conv) => sum + (conv.callInfo.stats?.ttsLatency || 0), 0)
      return totalLatency / conversationsWithStats.length
    },

    // Metric 7: Total Interruptions
    get totalInterruptions() {
      return this.filteredConversations.reduce((sum, conv) => sum + (conv.callInfo.stats?.interruptions || 0), 0)
    },

    // Additional computed values for charts
    get statusBreakdown() {
      type StatusType = "busy" | "success" | "transfer" | "no_answer" | "dropped";
      const breakdown = { busy: 0, success: 0, transfer: 0, no_answer: 0, dropped: 0 }
      this.filteredConversations.forEach((conv) => {
        breakdown[conv.status as StatusType]++
      })
      return Object.entries(breakdown).map(([status, count]) => ({ status, count }))
    },

    get agentBreakdown() {
      const breakdown: Record<string, number> = {}
      this.filteredConversations.forEach((conv) => {
        breakdown[conv.agent] = (breakdown[conv.agent] || 0) + 1
      })
      return Object.entries(breakdown).map(([agent, count]) => ({ agent, count }))
    },

    get callTypeBreakdown() {
      type CallType = 'inbound' | 'outbound';
      const breakdown = { inbound: 0, outbound: 0 }
      this.filteredConversations.forEach((conv) => {
        breakdown[conv.callInfo.type as CallType]++
      })
      return Object.entries(breakdown).map(([type, count]) => ({ type, count }))
    },
  }))

export { ConversationStore, Conversation, Filters }