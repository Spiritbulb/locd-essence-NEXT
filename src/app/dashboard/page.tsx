'use client' // Enables client-side rendering and hooks like useEffect

import { useEffect, useState } from 'react'

// Define the shape of each inventory item returned from the API
type InventoryItem = {
    item_id: string
    quantity: number
    item_name?: string
    price: number
}

export default function Dashboard() {
    // State to hold inventory items
    const [items, setItems] = useState<InventoryItem[]>([])
    // State to track loading status
    const [loading, setLoading] = useState(true)

    // Fetch inventory data from your Cloudflare Worker proxy
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('https://locdshop.spiritbulb.workers.dev/api/inventory')

                // Debug: log raw response if it failed
                if (!res.ok) {
                    const text = await res.text()
                    console.error('Server returned error page:', text)
                    setLoading(false)
                    return
                }

                const data = await res.json()
                console.log('Inventory response:', data)
                setItems(data)
            } catch (error) {
                console.error('Fetch error:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])


    // Show loading message while fetching
    if (loading) return <p className="p-4 text-gray-500">Loading inventory...</p>

    // Show fallback if no items are returned
    if (!items.length) return <p className="p-4 text-red-500">No items found.</p>

    // Render inventory grid
    return (
        <div className="p-4 mt-20">
            <h1 className="text-2xl font-bold mb-4 text-amber-800">Inventory Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                    <div
                        key={item.item_id}
                        className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-all"
                    >
                        <div className="text-xl font-semibold text-amber-700">Name: {item.item_name}</div>
                        <div className="text-xl font-semibold text-amber-700">ID: {item.item_id}</div>
                        <div className="mt-2 text-gray-700">Quantity: {item.quantity}</div>
                        <div className="mt-1 text-gray-600">
                            Price: <span className="font-medium text-green-700">${item.price}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
