import { useEffect, useRef, useState } from 'react'
import { useChat } from '@/context/ChatContext'
import { askHuggingFace } from '@/api/hugging'
import { nanoid } from 'nanoid'

export default function ChatArea() {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')
  const [{ chats, activeChatId }, dispatch] = useChat()

  const activeChat = chats.find(c => c.id === activeChatId)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (activeChatId) {
      dispatch({ type: 'MARK_READ', payload: activeChatId })
    }
  }, [activeChatId])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || !activeChat) return

    const userMsg = {
      id: nanoid(),
      chatId: activeChat.id,
      sender: 'user' as const,
      text,
      createdAt: Date.now(),
    }

    dispatch({ type: 'ADD_MESSAGE', payload: userMsg })
    setInput('')

    // если это чат с AI — ответить
    if (activeChat.isAI) {
      const aiText = await askHuggingFace(text)
      const aiMsg = {
        id: nanoid(),
        chatId: activeChat.id,
        sender: 'ai' as const,
        text: aiText,
        createdAt: Date.now(),
      }
      dispatch({ type: 'ADD_MESSAGE', payload: aiMsg })
    }
  }

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Выберите чат слева или создайте новый
      </div>
    )
  }

  return (
    <section className="flex flex-col bg-bg h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <h2 className="font-medium">{activeChat.title}</h2>
        {activeChat.isAI && (
          <span className="ml-2 text-sm text-primary font-semibold">🤖 AI</span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {activeChat.messages.map(m => (
          <div
            key={m.id}
            className={`rounded-xl p-3 shadow-sm w-fit ${
              m.sender === 'user'
                ? 'self-end bg-msg-out'
                : 'self-start bg-msg-in'
            }`}
          >
            {m.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="bg-white border-t border-gray-200 px-4 py-3 flex gap-2"
      >
        <textarea
          rows={1}
          className="flex-1 resize-none border rounded-lg px-3 py-2 focus:outline-primary"
          placeholder="Введите сообщение…"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-primary hover:bg-dark text-white px-4 py-2 rounded-lg transition"
        >
          Отправить
        </button>
      </form>
    </section>
  )
}
