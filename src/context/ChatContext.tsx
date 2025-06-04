import {
    createContext,
    useContext,
    useReducer,
    ReactNode,
    useEffect,
  } from 'react'
  
  type Sender = 'user' | 'ai'
  
  export interface Message {
    id: string
    chatId: string
    sender: Sender
    text: string
    createdAt: number
  }
  
  export interface Chat {
    id: string
    title: string
    isAI: boolean
    messages: Message[]
    unread: number
  }
  
  type State = {
    chats: Chat[]
    activeChatId: string | null
  }
  
  type Action =
    | { type: 'CREATE_CHAT'; payload: Chat }
    | { type: 'SET_ACTIVE_CHAT'; payload: string }
    | { type: 'ADD_MESSAGE'; payload: Message }
    | { type: 'MARK_READ'; payload: string }
  
  const initialState: State = {
    chats: [],
    activeChatId: null,
  }
  
  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case 'CREATE_CHAT':
        return { ...state, chats: [action.payload, ...state.chats] }
  
      case 'SET_ACTIVE_CHAT':
        return { ...state, activeChatId: action.payload }
  
      case 'ADD_MESSAGE': {
        const { chatId } = action.payload
        return {
          ...state,
          chats: state.chats.map(c =>
            c.id === chatId
              ? {
                  ...c,
                  messages: [...c.messages, action.payload],
                  unread:
                    chatId === state.activeChatId ? 0 : c.unread + 1,
                }
              : c
          ),
        }
      }
  
      case 'MARK_READ':
        return {
          ...state,
          chats: state.chats.map(c =>
            c.id === action.payload ? { ...c, unread: 0 } : c
          ),
        }
  
      default:
        return state
    }
  }
  
  const ChatContext = createContext<
    [State, React.Dispatch<Action>] | undefined
  >(undefined)
  
  export function ChatProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(
      reducer,
      undefined,
      (): State =>
        JSON.parse(localStorage.getItem('chat-state') || 'null') ?? initialState
    )
  
    useEffect(() => {
      localStorage.setItem('chat-state', JSON.stringify(state))
    }, [state])
  
    return (
      <ChatContext.Provider value={[state, dispatch]}>
        {children}
      </ChatContext.Provider>
    )
  }
  
  export function useChat() {
    const ctx = useContext(ChatContext)
    if (!ctx) throw new Error('useChat must be used within ChatProvider')
    return ctx
  }
  