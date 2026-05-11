'use client'

import React, { useState } from 'react'
import type { ApiFetcherBlock as ApiFetcherBlockProps } from '@/payload-types'

type User = {
  id: number
  name: string
  email: string
  username: string
}

export const ApiFetcherBlock: React.FC<ApiFetcherBlockProps> = ({ buttonLabel, title }) => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users')
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container my-12">
      <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
        {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
        
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium transition-all hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Fetching...' : buttonLabel || 'Fetch Users'}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-destructive/10 text-destructive rounded-md border border-destructive/20">
            {error}
          </div>
        )}

        {users.length > 0 && (
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <div 
                key={user.id} 
                className="p-4 border border-border rounded-lg bg-background/50 hover:border-primary/50 transition-colors"
              >
                <p className="font-semibold text-lg">{user.username}</p>
                <p className="text-muted-foreground text-sm">{user.email}</p>
              </div>
            ))}
          </div>
        )}
        
        {!loading && users.length === 0 && !error && (
          <p className="mt-4 text-muted-foreground italic text-sm">
            Click the button above to load users from the API.
          </p>
        )}
      </div>
    </div>
  )
}
