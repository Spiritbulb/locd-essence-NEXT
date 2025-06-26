'use client'

import { useEffect, useState } from 'react'
import { Edit, Trash2, Filter } from 'lucide-react'
import { InventoryItem } from '../types'

export default function ProductPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showFilter, setShowFilter] = useState(false)

  const fetchInventory = async () => {
    try {
      setError(null)
      setLoading(true)

      const res = await fetch('https://locdshop.spiritbulb.workers.dev/api/inventory', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.ok) {
        const errorText = await res.text()
        setError(`Server error: ${res.status} ${res.statusText}`)
        return
      }

      const data = await res.json()
      if (Array.isArray(data)) {
        setItems(data)
      } else if (data.error) {
        setError(data.error)
      } else {
        setError('Unexpected response format')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  const deleteItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.item_id !== itemId))
  }

  const filteredItems = selectedCategory
    ? items.filter(i =>
      i.category?.toLowerCase().includes(selectedCategory.toLowerCase())
    )
    : items

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-amber-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={fetchInventory}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 mt-10">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-amber-800">
          {selectedCategory || 'Explore Products'}
        </h1>

        <div className="relative">
          <button
            className="flex items-center gap-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md px-4 py-2 shadow-sm hover:bg-gray-50"
            onClick={() => setShowFilter(prev => !prev)}
          >
            <Filter size={16} className="text-amber-600" />
            {selectedCategory || 'Filter'}
          </button>
          {showFilter && (
            <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow z-10 w-40">
              {['All', 'Best Sellers', 'Newest In', 'Charms', 'Products'].map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category === 'All' ? null : category)
                    setShowFilter(false)
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${selectedCategory === category ? 'bg-amber-100 text-amber-800' : ''
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <p className="text-yellow-600 text-center py-8">
          No products found in this category.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map(item => (
            <div
              key={item.item_id}
              className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="text-lg font-semibold text-amber-700">
                  {item.item_name || 'Unnamed Product'}
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() =>
                      setEditingItem(editingItem === item.item_id ? null : item.item_id)
                    }
                    className="p-1 text-gray-400 hover:text-blue-500"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => deleteItem(item.item_id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-2">ID: {item.item_id}</div>
              <div className="flex justify-between items-center">
                <div className="text-gray-700">
                  Qty:{' '}
                  <span className={item.quantity < 10 ? 'text-red-600 font-medium' : ''}>
                    {item.quantity}
                  </span>
                </div>
                <div className="text-green-700 font-medium">${item.price}</div>
              </div>
              {item.quantity < 10 && (
                <div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                  Low Stock Alert
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
