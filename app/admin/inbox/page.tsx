'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Mail,
  Search,
  Check,
  X,
  User,
  Trash2,
  Reply,
  Loader2,
} from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/Button'
import { adminAPI } from '@/lib/api'
import { clsx } from 'clsx'

export default function InboxPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [viewMessageId, setViewMessageId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    try {
      setIsLoading(true)
      const data = await adminAPI.inbox.getAll()
      setMessages(data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkRead = async (id: string) => {
    try {
      await adminAPI.inbox.markAsRead(id)
      setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m))
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this message?')) {
      try {
        await adminAPI.inbox.delete(id)
        setMessages(prev => prev.filter(m => m.id !== id))
        setViewMessageId(null)
      } catch (error) {
        alert('Failed to delete')
      }
    }
  }

  const filteredMessages = messages.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.message.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const unreadCount = messages.filter(m => !m.isRead).length

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="font-display text-2xl font-bold text-gray-900">Inbox</h1>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">{unreadCount} New</span>
              )}
            </div>
            <Link href="/"><Button variant="outline" size="sm">View Store</Button></Link>
          </div>
        </header>

        <div className="p-8">
          <div className="bg-white rounded-2xl shadow-soft p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-20 bg-white rounded-2xl shadow-soft">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              </div>
            ) : filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                  setViewMessageId(msg.id)
                  if (!msg.isRead) handleMarkRead(msg.id)
                }}
                className={clsx(
                  'bg-white rounded-2xl shadow-soft p-6 cursor-pointer hover:shadow-md transition-all',
                  !msg.isRead && 'border-l-4 border-primary-500'
                )}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{msg.name}</h4>
                      <p className="text-sm text-gray-500">{msg.email}</p>
                      <p className="mt-2 text-gray-700 line-clamp-2">{msg.message}</p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}

            {!isLoading && filteredMessages.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl shadow-soft">
                <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Inbox is empty</p>
              </div>
            )}
          </div>
        </div>

        {/* Message Modal */}
        {viewMessageId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6">
              {(() => {
                const msg = messages.find(m => m.id === viewMessageId)
                if (!msg) return null
                return (
                  <>
                    <div className="flex justify-between mb-6">
                      <h3 className="font-semibold text-xl">Message from {msg.name}</h3>
                      <button onClick={() => setViewMessageId(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X /></button>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl mb-6">
                      <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                    </div>
                    <div className="space-y-4">
                      <textarea
                        rows={3}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type reply..."
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none"
                      />
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => handleDelete(msg.id)}>Delete</Button>
                        <Button onClick={() => alert('Reply Sent')}>Send Reply</Button>
                      </div>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
