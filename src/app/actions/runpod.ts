'use server'

export type RunpodJobStatus = 'IN_QUEUE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'TIMED_OUT'

export interface RunpodSubmitResult {
  success: boolean
  jobId?: string
  error?: string
}

export interface RunpodStatusResult {
  success: boolean
  status?: RunpodJobStatus
  output?: any
  error?: string
  executionTime?: number
}

/**
 * Submits a job to RunPod API.
 * The API key is fetched from the endpoint config server-side — never exposed to client.
 */
export async function submitRunpodJob(
  apiId: string,
  apiKey: string,
  input: {
    prompt: string
    image: string
    duration: number
    enable_prompt_expansion: boolean
    go_fast: boolean
  },
): Promise<RunpodSubmitResult> {
  try {
console.log("asdfasdf")
console.log("😊,",JSON.stringify({ input }))
    const url = `https://api.runpod.ai/v2/${apiId}/run`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ input }),
    })
    if (!response.ok) {
      const errText = await response.text()
      return {
        success: false,
        error: `RunPod API error ${response.status}: ${errText}`,
      }
    }

    const data = await response.json()

    return {
      success: true,
      jobId: data.id,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Unknown error submitting job',
    }
  }
}

/**
 * Polls RunPod API for job status.
 * Returns current status and output if completed.
 */
export async function checkRunpodStatus(
  apiId: string,
  apiKey: string,
  jobId: string,
): Promise<RunpodStatusResult> {
  try {
    const url = `https://api.runpod.ai/v2/${apiId}/status/${jobId}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      // Prevent caching so each poll gets fresh data
      cache: 'no-store',
    })

    if (!response.ok) {
      const errText = await response.text()
      return {
        success: false,
        error: `RunPod status error ${response.status}: ${errText}`,
      }
    }

    const data = await response.json()

    return {
      success: true,
      status: data.status as RunpodJobStatus,
      output: data.output ?? null,
      executionTime: data.executionTime ?? undefined,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Unknown error checking status',
    }
  }
}
