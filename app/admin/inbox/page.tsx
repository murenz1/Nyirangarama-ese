'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Mail,
  Search,
  Filter,
  Eye,
  Trash2,
  Reply,
  Check,
  X,
  Clock,
  User,
  ChevronDown,
  ArrowUpDown,
} from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/Button'
import { clsx } from 'clsx'

// Mock inbox messages from Contact Us page
const mockMessages = [
  {
    id: 'MSG-001',
    name: 'Jean Pierre',
    email: 'jean.pierre@example.com',
    phone: '+250 788 123 456',
    subject: 'general',
    message: 'Hello, I would like to know if you offer bulk discounts for restaurants. We are interested in purchasing your juices and chili oil in large quantities.',
    status: 'unread',
    createdAt: '2024-03-20T10:30:00Z',
  },
  {
    id: 'MSG-002',
    name: 'Marie Claire',
    email: 'marie.claire@example.com',
    phone: '+250 788 987 654',
    subject: 'order',
    message: 'I placed an order yesterday (ORD-1234) but haven\'t received a confirmation email yet. Could you please check the status?',
    status: 'read',
    createdAt: '2024-03-19T14:20:00Z',
  },
  {
    id: 'MSG-003',
    name: 'Patrick Mugabe',
    email: 'patrick.m@example.com',
    phone: '+250 789 456 789',
    subject: 'partnership',
    message: 'I represent a retail chain in Kigali and we are interested in becoming a distributor for Nyirangarama products. Please send me your wholesale pricing.',
    status: 'replied',
    createdAt: '2024-03-18T09:15:00Z',
  },
  {
    id: 'MSG-004',
    name: 'Alice Uwase',
    email: 'alice.u@example.com',
    phone: '+250 785 321 654',
    subject: 'product',
    message: 'Do you have any gluten-free products? I have celiac disease and need to know which items are safe for me to consume.',
    status: 'unread',
    createdAt: '2024-03-17T16:45:00Z',
  },
  {
    id: 'MSG-005',
    name: 'Robert Habineza',
    email: 'robert.h@example.com',
    phone: '+250 788 777 888',
    subject: 'feedback',
    message: 'Just wanted to say thank you for the amazing products! The Agashya passion juice is my favorite. Keep up the great work!',
    status: 'read',
    createdAt: '2024-03-16T11:30:00Z',
  },
]

const subjectLabels: Record<string, string> = {
  general: 'General Inquiry',
  order: 'Order Status',
  product: 'Product Info',
  partnership: 'Partnership',
  feedback: 'Feedback',
}

const subjectColors: Record<string, string> = {
  general: 'bg-blue-100 text-blue-700',
  order: 'bg-purple-100 text-purple-700',
  product: 'bg-green-100 text-green-700',
  partnership: 'bg-amber-100 text-amber-700',
  feedback: 'bg-pink-100 text-pink-700',
}

export default function InboxPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [viewMessage, setViewMessage] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [messages, setMessages] = useState(mockMessages)

  const filteredMessages = messages
    .filter((msg) => {
      const matchesSearch =
        msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || msg.status === statusFilter
      const matchesSubject = subjectFilter === 'all' || msg.subject === subjectFilter
      return matchesSearch && matchesStatus && matchesSubject
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return 0
    })

  const unreadCount = messages.filter(m => m.status === 'unread').length

  const handleReply = (msgId: string) => {
    if (!replyText.trim()) return
    setMessages(messages.map(m => m.id === msgId ? { ...m, status: 'replied' } : m))
    setReplyText('')
    setViewMessage(null)
    alert('Reply sent successfully!')
  }

  const handleDelete = (msgId: string) => {
    setMessages(messages.filter(m => m.id !== msgId))
    setViewMessage(null)
  }

  const handleMarkAsRead = (msgId: string) => {
    setMessages(messages.map(m => m.id === msgId ? { ...m, status: 'read' } : m))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="font-display text-2xl font-bold text-gray-900">
                Inbox
              </h1>
              {unreadCount > 0 && (
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  View Store
                </Button>
              </Link>
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="font-semibold text-primary-700">A</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', count: messages.length, color: 'bg-primary-100 text-primary-600' },
              { label: 'Unread', count: messages.filter(m => m.status === 'unread').length, color: 'bg-red-100 text-red-600' },
              { label: 'Read', count: messages.filter(m => m.status === 'read').length, color: 'bg-blue-100 text-blue-600' },
              { label: 'Replied', count: messages.filter(m => m.status === 'replied').length, color: 'bg-green-100 text-green-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl shadow-soft p-4">
                <div className="flex items-center gap-3">
                  <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center', stat.color)}>
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-soft p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Subject Filter */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all appearance-none bg-white"
                >
                  <option value="all">All Subjects</option>
                  {Object.entries(subjectLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Sort */}
              <div className="relative">
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all appearance-none bg-white"
                >
                  <option value="date">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Messages List */}
          <div className="space-y-4">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                  setViewMessage(msg.id)
                  if (msg.status === 'unread') handleMarkAsRead(msg.id)
                }}
                className={clsx(
                  'bg-white rounded-2xl shadow-soft p-6 cursor-pointer transition-all hover:shadow-md',
                  msg.status === 'unread' && 'border-l-4 border-primary-500'
                )}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{msg.name}</h4>
                        <span className={clsx('px-2 py-0.5 rounded-full text-xs font-medium', subjectColors[msg.subject])}>
                          {subjectLabels[msg.subject]}
                        </span>
                        {msg.status === 'unread' && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">New</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-1">{msg.email} • {msg.phone}</p>
                      <p className="text-gray-700 line-clamp-2">{msg.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 lg:flex-col lg:items-end">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {new Date(msg.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={clsx(
                        'px-3 py-1 rounded-full text-xs font-medium capitalize',
                        msg.status === 'unread' && 'bg-red-100 text-red-700',
                        msg.status === 'read' && 'bg-blue-100 text-blue-700',
                        msg.status === 'replied' && 'bg-green-100 text-green-700'
                      )}>
                        {msg.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredMessages.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl shadow-soft">
                <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No messages found</p>
              </div>
            )}
          </div>

          {/* View/Reply Modal */}
          {viewMessage && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {(() => {
                  const msg = messages.find(m => m.id === viewMessage)
                  if (!msg) return null
                  return (
                    <>
                      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-xl text-gray-900">Message Details</h3>
                          <span className={clsx('px-3 py-1 rounded-full text-xs font-medium', subjectColors[msg.subject])}>
                            {subjectLabels[msg.subject]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(msg.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <button onClick={() => setViewMessage(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-start gap-4 mb-6">
                          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-primary-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{msg.name}</h4>
                            <p className="text-sm text-gray-500">{msg.email}</p>
                            <p className="text-sm text-gray-500">{msg.phone}</p>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                          <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                          Received {new Date(msg.createdAt).toLocaleString('en-US')}
                        </p>
                        {msg.status !== 'replied' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Reply</label>
                            <textarea
                              rows={4}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Type your reply..."
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none resize-none"
                            />
                            <div className="flex justify-end gap-3 mt-4">
                              <Button variant="outline" onClick={() => setViewMessage(null)}>Cancel</Button>
                              <Button onClick={() => handleReply(msg.id)}>
                                <Reply className="w-4 h-4 mr-2" />
                                Send Reply
                              </Button>
                            </div>
                          </div>
                        )}
                        {msg.status === 'replied' && (
                          <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-xl">
                            <Check className="w-5 h-5" />
                            <span>You have already replied to this message</span>
                          </div>
                        )}
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
