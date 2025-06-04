import { useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { useChat } from '@/context/ChatContext'
import { nanoid } from 'nanoid'

export default function Sidebar() {
  const [query, setQuery] = useState('')
  const [{ chats, activeChatId }, dispatch] = useChat()

  const filtered = chats.filter(c =>
    c.title.toLowerCase().includes(query.toLowerCase())
  )

  const createChat = () => {
    const title = prompt('Название чата')?.trim()
    if (!title) return
    const newId = nanoid()
    dispatch({
      type: 'CREATE_CHAT',
      payload: {
        id: newId,
        title,
        isAI: false,
        messages: [],
        unread: 0,
      },
    })
    dispatch({ type: 'SET_ACTIVE_CHAT', payload: newId })
  }

  const createAIChat = () => {
    const newId = nanoid()
    dispatch({
      type: 'CREATE_CHAT',
      payload: {
        id: newId,
        title: '🤖 AI Бот',
        isAI: true,
        messages: [],
        unread: 0,
      },
    })
    dispatch({ type: 'SET_ACTIVE_CHAT', payload: newId })
  }

  return (
    <aside className="bg-white border-r border-gray-200 flex flex-col">
      <header className="p-4 flex items-center justify-between border-b border-gray-200">
        <h1 className="font-semibold text-lg">Telegram Clone</h1>
        <button
          className="text-primary hover:text-dark transition"
          title="Новый чат"
          onClick={createChat}
        >
          <AiOutlinePlus size={20} />
        </button>
      </header>

      <button
        onClick={createAIChat}
        className="text-xs text-primary underline px-4 pb-2 hover:text-dark transition"
      >
        Новый чат с ИИ
      </button>

      <input
        className="m-4 px-3 py-2 rounded-lg border border-gray-300 focus:outline-primary"
        placeholder="Поиск…"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      <ul className="flex-1 overflow-y-auto space-y-1 px-2">
        {filtered.map(chat => (
          <li
            key={chat.id}
            onClick={() =>
              dispatch({ type: 'SET_ACTIVE_CHAT', payload: chat.id })
            }
            className={`px-3 py-2 rounded-lg cursor-pointer flex justify-between items-center ${
              chat.id === activeChatId
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-gray-100'
            }`}
          >
            <span>{chat.title}</span>
            {chat.unread > 0 && (
              <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                {chat.unread}
              </span>
            )}
          </li>
        ))}

        {filtered.length === 0 && (
          <li className="text-sm text-gray-500 px-3 pt-4">
            Чаты не найдены
          </li>
        )}
      </ul>
    </aside>
  )
}
