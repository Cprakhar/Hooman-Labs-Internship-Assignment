"use client"

import { createContext, useContext, type ReactNode } from "react"
import { ConversationStore } from "./conversation-store"
import type { Instance } from "mobx-state-tree"

type IConversationStore = Instance<typeof ConversationStore>

const store = ConversationStore.create({
  conversations: [],
  filters: {},
  loading: false,
})

const StoreContext = createContext<IConversationStore>(store)

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export const useStore = () => {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}