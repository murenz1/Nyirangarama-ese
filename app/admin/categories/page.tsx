'use client'

import { useState, useEffect } from 'react'
import {
    Tag,
    Plus,
    Edit,
    Trash2,
    X,
    Loader2,
    Search,
    Package,
} from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/Button'
import { productsAPI, adminAPI } from '@/lib/api'
import { Category } from '@/data/types'
import Link from 'next/link'

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [addModal, setAddModal] = useState(false)
    const [editModal, setEditModal] = useState<Category | null>(null)

    useEffect(() => {
        fetchCategories()
    }, [])

    async function fetchCategories() {
        try {
            setIsLoading(true)
            const data = await productsAPI.getCategories()
            setCategories(data)
        } catch (error) {
            console.error('Error fetching categories:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure? This may affect products in this category.')) {
            try {
                await adminAPI.categories.delete(id)
                setCategories(categories.filter(c => c.id !== id))
            } catch (error) {
                alert('Failed to delete category')
            }
        }
    }

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />

            <main className="ml-64 min-h-screen">
                <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                    <div className="px-8 py-4 flex items-center justify-between">
                        <h1 className="font-display text-2xl font-bold text-gray-900">Categories</h1>
                        <div className="flex items-center gap-4">
                            <Button size="sm" onClick={() => setAddModal(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Category
                            </Button>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    <div className="bg-white rounded-2xl shadow-soft p-4 mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Description</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Slug</th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredCategories.map((category) => (
                                            <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                                            <Tag className="w-5 h-5 text-primary-600" />
                                                        </div>
                                                        <p className="font-medium text-gray-900">{category.name}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {category.description || 'No description'}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-mono text-gray-400">
                                                    {category.slug}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => setEditModal(category)} className="p-2 text-gray-400 hover:text-blue-600">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDelete(category.id)} className="p-2 text-gray-400 hover:text-red-600">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {!isLoading && filteredCategories.length === 0 && (
                            <div className="text-center py-20">
                                <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No categories found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Add Modal */}
                {addModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
                            <form onSubmit={async (e) => {
                                e.preventDefault()
                                const formData = new FormData(e.currentTarget)
                                try {
                                    await adminAPI.categories.create({
                                        name: formData.get('name') as string,
                                        description: formData.get('description') as string,
                                        slug: (formData.get('name') as string).toLowerCase().replace(/ /g, '-'),
                                        image: '/images/categories/placeholder.jpg'
                                    })
                                    fetchCategories()
                                    setAddModal(false)
                                } catch (error) {
                                    alert('Error creating category')
                                }
                            }}>
                                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                    <h3 className="font-semibold text-lg">Add New Category</h3>
                                    <button type="button" onClick={() => setAddModal(false)}><X className="w-5 h-5" /></button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Name</label>
                                        <input name="name" required className="w-full px-4 py-2 border rounded-xl outline-primary-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Description</label>
                                        <textarea name="description" rows={3} className="w-full px-4 py-2 border rounded-xl outline-primary-500 resize-none" />
                                    </div>
                                </div>
                                <div className="p-6 border-t flex justify-end gap-3">
                                    <Button type="button" variant="outline" onClick={() => setAddModal(false)}>Cancel</Button>
                                    <Button type="submit">Create</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {editModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
                            <form onSubmit={async (e) => {
                                e.preventDefault()
                                const formData = new FormData(e.currentTarget)
                                const name = formData.get('name') as string
                                try {
                                    const updated = await adminAPI.categories.update(editModal.id, {
                                        name,
                                        slug: (formData.get('slug') as string) || name.toLowerCase().replace(/\s+/g, '-'),
                                        description: formData.get('description') as string,
                                    })
                                    setCategories(prev => prev.map(c => c.id === editModal.id ? { ...c, ...(updated as Partial<Category>) } : c))
                                    setEditModal(null)
                                } catch (error) {
                                    alert('Error updating category')
                                }
                            }}>
                                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                    <h3 className="font-semibold text-lg">Edit Category</h3>
                                    <button type="button" onClick={() => setEditModal(null)}><X className="w-5 h-5" /></button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Name</label>
                                        <input name="name" required defaultValue={editModal.name} className="w-full px-4 py-2 border rounded-xl outline-primary-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Slug</label>
                                        <input name="slug" defaultValue={editModal.slug} className="w-full px-4 py-2 border rounded-xl outline-primary-500 font-mono text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Description</label>
                                        <textarea name="description" rows={3} defaultValue={editModal.description || ''} className="w-full px-4 py-2 border rounded-xl outline-primary-500 resize-none" />
                                    </div>
                                </div>
                                <div className="p-6 border-t flex justify-end gap-3">
                                    <Button type="button" variant="outline" onClick={() => setEditModal(null)}>Cancel</Button>
                                    <Button type="submit">Save Changes</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
