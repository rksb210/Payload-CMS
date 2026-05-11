'use server'

export async function getRunPodEndpoints() {
  const query = `
    query GetAllPublicEndpoints {
      allAiApiPublicConfigs {
        id
        aiApiId
        modelName
        displayName
        description
        metadata
        isLive
        createdAt
        updatedAt
        __typename
      }
    }`;

  try {
    const response = await fetch('https://api.runpod.io/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_RUNPOD_KEY}`,
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    const result = await response.json()
    
    if (result.errors) {
      throw new Error(result.errors[0].message)
    }

    return { data: result.data.allAiApiPublicConfigs, error: null }
  } catch (err) {
    console.error('Error in getRunPodEndpoints server action:', err)
    return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch from RunPod' }
  }
}
