'use client'

import { useEffect, useState } from 'react'

type InventoryItem = {
    item_id: string
    quantity: number
    item_name?: string
    price: number
}

export default function Dashboard() {
    const [items, setItems] = useState<InventoryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(null)
                
                const res = await fetch('https://locdshop.spiritbulb.workers.dev/api/inventory', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                if (!res.ok) {
                    const errorText = await res.text()
                    console.error('Server error:', errorText)
                    setError(`Server error: ${res.status} ${res.statusText}`)
                    return
                }

                const data = await res.json()
                console.log('Inventory response:', data)
                
                if (Array.isArray(data)) {
                    setItems(data)
                } else if (data.error) {
                    setError(data.error)
                } else {
                    setError('Unexpected response format')
                }
                
            } catch (error) {
                console.error('Fetch error:', error)
                setError(error instanceof Error ? error.message : 'Unknown error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) return <p className="p-4 text-gray-500">Loading inventory...</p>
    
    if (error) return (
        <div className="p-4">
            <p className="text-red-500 mb-2">Error: {error}</p>
            <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Retry
            </button>
        </div>
    )
    
    if (!items.length) return <p className="p-4 text-yellow-500">No items found.</p>

    return (
        <div className="p-4 mt-20">
            <h1 className="text-2xl font-bold mb-4 text-amber-800">Inventory Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                    <div
                        key={item.item_id}
                        className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-all"
                    >
                        <div className="text-xl font-semibold text-amber-700">
                            Name: {item.item_name || 'Unknown'}
                        </div>
                        <div className="text-xl font-semibold text-amber-700">
                            ID: {item.item_id}
                        </div>
                        <div className="mt-2 text-gray-700">
                            Quantity: {item.quantity}
                        </div>
                        <div className="mt-1 text-gray-600">
                            Price: <span className="font-medium text-green-700">${item.price}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}