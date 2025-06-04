import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'


export default function App() {
  return (
    <div className="h-screen w-screen grid grid-cols-[20rem_1fr]">
      <Sidebar />
      <ChatArea />
    </div>
  )
}
