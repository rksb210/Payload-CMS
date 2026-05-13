import React from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Playground } from '@/components/Playground'

export default async function EndpointPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'endpoints',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })

  const endpoint = result.docs[0]
  if (!endpoint) return notFound()

  return (
    <main className="min-h-screen bg-background">
      <Playground data={endpoint as any} />
    </main>
  )
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const endpoints = await payload.find({
    collection: 'endpoints',
    limit: 100,
    select: { slug: true },
  })
  return endpoints.docs.map(({ slug }) => ({ slug }))
}
