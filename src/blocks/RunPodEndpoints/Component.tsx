'use client'

import React, { useEffect, useState } from 'react'
import type { RunPodEndpointsBlock as RunPodEndpointsProps } from '@/payload-types'
import { getRunPodEndpoints } from './actions'

type PublicEndpoint = {
  id: string
  aiApiId: string
  modelName: string
  displayName: string
  description: string
  metadata: any
  isLive: boolean
  createdAt: string
  updatedAt: string
}

export const RunPodEndpointsBlock: React.FC<RunPodEndpointsProps> = ({ title, description }) => {
  const [endpoints, setEndpoints] = useState<PublicEndpoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEndpoints = async () => {
      setLoading(true)
      const { data, error: serverError } = await getRunPodEndpoints()
      
      if (serverError) {
        setError(serverError)
      } else if (data) {
        setEndpoints(data)
      }
      
      setLoading(false)
    }

    fetchEndpoints()
  }, [])

  return (
    <div className="container py-16">
      <div className="mb-12 text-center md:text-left">
        <h2 className="text-4xl font-bold tracking-tight mb-4">{title}</h2>
        <p className="text-muted-foreground text-lg max-w-2xl">{description}</p>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-50 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-destructive/10 text-destructive rounded-xl border border-destructive/20">
          {error}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {endpoints.map((endpoint) => (
            <div 
              key={endpoint.id}
              className="group relative bg-card border border-border hover:border-primary/50 rounded-2xl p-6 transition-all hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  {endpoint.isLive ? (
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                      Live
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                      Offline
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {endpoint.displayName || endpoint.modelName}
                </h3>
                
                <p className="text-muted-foreground text-sm line-clamp-3 mb-6">
                  {endpoint.description || 'No description available for this model.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                <span className="text-xs text-muted-foreground font-mono">
                  {endpoint.aiApiId}
                </span>
                <button className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                  Deploy
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
