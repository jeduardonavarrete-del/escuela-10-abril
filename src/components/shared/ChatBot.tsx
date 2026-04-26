'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'bot'
  text: string
}

const QUICK_REPLIES = [
  '¿A qué hora es la salida?',
  '¿Cómo justifico a mi hijo?',
  '¿Cuándo entregan boletas?',
  '¿Cuál es el uniforme?',
]

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: '¡Hola! Soy el Asistente Virtual de la ESF "10 de Abril". ¿En qué puedo ayudarte?' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Lo siento, hubo un error. Intenta de nuevo.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Burbuja flotante */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300',
          open ? 'bg-red-500 hover:bg-red-600' : 'bg-green-700 hover:bg-green-800'
        )}
      >
        {open ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </button>

      {/* Ventana de chat */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-green-700 px-4 py-3 flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Asistente 10 de Abril</p>
              <p className="text-green-200 text-xs">En línea</p>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-72">
            {messages.map((msg, i) => (
              <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div
                  className={cn(
                    'max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-green-700 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-3 py-2 rounded-2xl rounded-bl-sm">
                  <span className="text-gray-500 text-xs">Escribiendo...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          <div className="px-3 pb-2 flex gap-1.5 flex-wrap">
            {QUICK_REPLIES.map(r => (
              <button
                key={r}
                onClick={() => sendMessage(r)}
                className="text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-2.5 py-1 hover:bg-green-100 transition-colors"
              >
                {r}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-3 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder="Escribe tu pregunta..."
              className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-green-500 transition-colors"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="w-9 h-9 bg-green-700 rounded-xl flex items-center justify-center disabled:opacity-40 hover:bg-green-800 transition-colors"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
