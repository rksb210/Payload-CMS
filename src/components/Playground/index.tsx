'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { submitRunpodJob, checkRunpodStatus } from '@/app/actions/runpod'
import type { RunpodJobStatus } from '@/app/actions/runpod'

// ─── Types ────────────────────────────────────────────────────────────────────
interface PlaygroundProps {
  data: {
    title: string
    description?: string
    aiApiId: string
    runpodApiKey: string
    pricing?: string
    defaultPrompt?: string
    defaultImage?: string
    defaultDuration?: '6' | '10'
    defaultEnablePromptExpansion?: boolean
    defaultGoFast?: boolean
    previewImage?: { url?: string }
    previewVideo?: { url?: string }
    previewAudio?: { url?: string }
  }
}

type UIStatus = 'idle' | 'submitting' | 'polling' | 'completed' | 'failed'

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: UIStatus }) => {
  const cfg: Record<UIStatus, { color: string; dot: string; label: string }> = {
    idle:       { color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',   dot: 'bg-blue-500',   label: 'Idle' },
    submitting: { color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', dot: 'bg-yellow-500', label: 'Submitting…' },
    polling:    { color: 'bg-orange-500/10 text-orange-500 border-orange-500/20', dot: 'bg-orange-400',  label: 'Running…' },
    completed:  { color: 'bg-green-500/10 text-green-500 border-green-500/20',  dot: 'bg-green-500',  label: 'Completed' },
    failed:     { color: 'bg-red-500/10 text-red-500 border-red-500/20',     dot: 'bg-red-500',    label: 'Failed' },
  }
  const c = cfg[status]
  return (
    <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${c.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot} ${status === 'polling' ? 'animate-pulse' : ''}`} />
      {c.label}
    </span>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export const Playground: React.FC<PlaygroundProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'playground' | 'api'>('playground')
  const [resultTab, setResultTab] = useState<'preview' | 'json'>('preview')
  const [showAdditional, setShowAdditional] = useState(false)

  // Input state — initialised from CMS defaults
  const [prompt, setPrompt]                       = useState(data.defaultPrompt ?? '')
  const [imageUrl, setImageUrl]                   = useState(data.defaultImage ?? 'https://image.runpod.ai/assets/minimax/hailuo-2-3-fast.jpeg')
  const [duration, setDuration]                   = useState<6 | 10>(Number(data.defaultDuration ?? '6') as 6 | 10)
  const [enablePromptExpansion, setEnablePrompt]  = useState(data.defaultEnablePromptExpansion ?? true)
  const [goFast, setGoFast]                       = useState(data.defaultGoFast ?? true)

  // Result state
  const [uiStatus, setUiStatus]       = useState<UIStatus>('idle')
  const [jobId, setJobId]             = useState<string | null>(null)
  const [apiOutput, setApiOutput]     = useState<any>(null)
  const [errorMsg, setErrorMsg]       = useState<string | null>(null)
  const [execTime, setExecTime]       = useState<number | null>(null)
  const [resultMediaUrl, setResultMediaUrl] = useState<string | null>(null)

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Helpers ────────────────────────────────────────────────────────────────
  const stopPolling = () => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
  }

  const pollStatus = useCallback(async (id: string) => {
    const res = await checkRunpodStatus(data.aiApiId, data.runpodApiKey, id)
    if (!res.success) {
      stopPolling()
      setUiStatus('failed')
      setErrorMsg(res.error ?? 'Status check failed')
      return
    }

    const s = res.status as RunpodJobStatus
    if (s === 'COMPLETED') {
      stopPolling()
      setApiOutput(res.output)
      setExecTime(res.executionTime ?? null)
      setUiStatus('completed')
      // Try to extract a media URL from output
      const out = res.output
      if (out) {
        const url =
          out.video_url ?? out.video ?? out.gif_url ??
          out.image_url ?? out.image ?? out.audio_url ?? out.audio ??
          (typeof out === 'string' ? out : null)
        setResultMediaUrl(url)
      }
    } else if (s === 'FAILED' || s === 'CANCELLED' || s === 'TIMED_OUT') {
      stopPolling()
      setUiStatus('failed')
      setErrorMsg(`Job ${s.toLowerCase()}`)
    }
  }, [data.aiApiId, data.runpodApiKey])

  // ── Run ────────────────────────────────────────────────────────────────────
  const handleRun = async () => {
    stopPolling()
    setUiStatus('submitting')
    setErrorMsg(null)
    setApiOutput(null)
    setResultMediaUrl(null)
    setResultTab('preview')
    const res = await submitRunpodJob(data.aiApiId, data.runpodApiKey, {
      prompt,
      image: imageUrl,
      duration,
      enable_prompt_expansion: enablePromptExpansion,
      go_fast: goFast,
    })

    if (!res.success || !res.jobId) {
      setUiStatus('failed')
      setErrorMsg(res.error ?? 'Failed to submit job')
      return
    }

    setJobId(res.jobId)
    setUiStatus('polling')
    // Poll every 3 seconds
    pollRef.current = setInterval(() => pollStatus(res.jobId!), 3000)
  }

  // ── Reset ──────────────────────────────────────────────────────────────────
  const handleReset = () => {
    stopPolling()
    setPrompt(data.defaultPrompt ?? '')
    setImageUrl(data.defaultImage ?? 'https://image.runpod.ai/assets/minimax/hailuo-2-3-fast.jpeg')
    setDuration(Number(data.defaultDuration ?? '6') as 6 | 10)
    setEnablePrompt(data.defaultEnablePromptExpansion ?? true)
    setGoFast(data.defaultGoFast ?? true)
    setUiStatus('idle')
    setJobId(null)
    setApiOutput(null)
    setResultMediaUrl(null)
    setErrorMsg(null)
    setExecTime(null)
  }

  const isRunning = uiStatus === 'submitting' || uiStatus === 'polling'

  // ── Current payload preview ────────────────────────────────────────────────
  const currentPayload = {
    input: { prompt, image: imageUrl, duration, enable_prompt_expansion: enablePromptExpansion, go_fast: goFast },
  }

  // ── Default preview media (from CMS) ──────────────────────────────────────
  const defaultPreviewUrl = data.previewVideo?.url ?? data.previewImage?.url ?? data.previewAudio?.url ?? null

  // ── Detect if result is video/image/audio ─────────────────────────────────
  const isVideo = (url: string) => /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url) || url.includes('video')
  const isAudio = (url: string) => /\.(mp3|wav|ogg|aac)(\?|$)/i.test(url) || url.includes('audio')

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <span className="font-medium">RunPod</span>
          <span>/</span>
          <span className="text-foreground font-semibold">{data.title}</span>
        </div>
        <p className="text-muted-foreground max-w-3xl text-sm">
          {data.description ?? 'AI model playground. Configure inputs and click Run to generate.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border pb-px">
        {(['playground', 'api'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            {tab === 'playground' ? '🎮' : '<>'} {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Playground Tab */}
      {activeTab === 'playground' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* ── LEFT: Inputs ──────────────────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Input</h3>
              <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                {data.aiApiId}
              </span>
            </div>

            {/* Prompt */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <label className="font-medium">Prompt</label>
                <span className="text-muted-foreground italic text-xs">Optional</span>
              </div>
              <Textarea
                placeholder="Describe the motion or scene you want to generate…"
                className="min-h-[120px] resize-none"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isRunning}
              />
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-orange-500 dark:text-orange-400">Duration</label>
              <p className="text-xs text-muted-foreground">Duration in seconds</p>
              <div className="flex gap-2">
                {([6, 10] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    disabled={isRunning}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium border transition-all disabled:opacity-50 ${
                      duration === d
                        ? 'bg-secondary text-secondary-foreground border-border'
                        : 'bg-transparent text-muted-foreground border-border hover:bg-muted'
                    }`}
                  >
                    {d}s
                  </button>
                ))}
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Image</label>
              <p className="text-xs text-muted-foreground">Upload your image here.</p>
              <Input
                placeholder="Enter URL or base64 data"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                disabled={isRunning}
                className="font-mono text-xs"
              />
              {imageUrl && (
                <div className="flex items-center gap-3 p-2 border border-border rounded-lg bg-muted/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="preview"
                    className="h-10 w-10 object-cover rounded"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <span className="text-xs text-blue-500 truncate flex-1 font-mono">{imageUrl}</span>
                  <button onClick={() => setImageUrl('')} className="text-muted-foreground hover:text-foreground text-xs">✕</button>
                </div>
              )}
              <p className="text-[10px] text-muted-foreground">jpeg, jpg, png up to 16MB (single file)</p>
            </div>

            {/* Additional Settings */}
            <div className="border border-border rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/30 transition-colors"
                onClick={() => setShowAdditional(!showAdditional)}
              >
                <span>Additional settings</span>
                <svg
                  className={`w-4 h-4 transition-transform ${showAdditional ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {showAdditional && (
                <div className="px-4 pb-4 space-y-3 border-t border-border pt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="enable-prompt-expansion"
                      checked={enablePromptExpansion}
                      onCheckedChange={(v) => setEnablePrompt(Boolean(v))}
                      disabled={isRunning}
                    />
                    <Label htmlFor="enable-prompt-expansion" className="text-sm font-normal">
                      Enable prompt expansion
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="go-fast"
                      checked={goFast}
                      onCheckedChange={(v) => setGoFast(Boolean(v))}
                      disabled={isRunning}
                    />
                    <Label htmlFor="go-fast" className="text-sm font-normal">
                      Go fast mode
                    </Label>
                  </div>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="flex items-center gap-2 text-green-500 font-medium text-sm">
              <span>$</span>
              <span>{data.pricing ?? '$0.19 per second'}</span>
            </div>

            {/* Error message */}
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {errorMsg}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-2">
              <Button variant="secondary" className="flex-1" onClick={handleReset} disabled={isRunning}>
                Reset
              </Button>
              <Button
                className="flex-1 bg-primary text-primary-foreground hover:opacity-90"
                onClick={handleRun}
                disabled={isRunning}
              >
                {isRunning ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    {uiStatus === 'submitting' ? 'Submitting…' : 'Running…'}
                  </span>
                ) : (
                  'Run'
                )}
              </Button>
            </div>
          </div>

          {/* ── RIGHT: Result ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">Result</h3>
              <StatusBadge status={uiStatus} />
              {execTime && (
                <span className="text-xs text-muted-foreground ml-auto">
                  {(execTime / 1000).toFixed(1)}s
                </span>
              )}
            </div>

            <Card className="flex-1 min-h-[500px] border-border overflow-hidden flex flex-col">
              {/* Result tabs + download */}
              <div className="flex items-center justify-between p-2 border-b border-border bg-muted/20">
                <div className="flex gap-1">
                  {(['preview', 'json'] as const).map((t) => (
                    <Button
                      key={t}
                      variant={resultTab === t ? 'secondary' : 'ghost'}
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => setResultTab(t)}
                    >
                      {t === 'preview' ? '🖼 Preview' : '{} JSON'}
                    </Button>
                  ))}
                </div>
                {resultMediaUrl && (
                  <a
                    href={resultMediaUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 border border-border rounded px-2 py-1 transition-colors"
                  >
                    ↓ Download
                  </a>
                )}
              </div>

              {/* Preview Panel */}
              {resultTab === 'preview' && (
                <div className="flex-1 flex items-center justify-center bg-black/5 relative min-h-[440px]">
                  {/* Running spinner overlay */}
                  {isRunning && (
                    <div className="flex flex-col items-center gap-4">
                      <svg className="animate-spin h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <p className="text-sm text-muted-foreground">
                        {uiStatus === 'submitting' ? 'Submitting job…' : `Generating… (Job: ${jobId?.slice(0, 8)}…)`}
                      </p>
                    </div>
                  )}

                  {/* API result media */}
                  {!isRunning && resultMediaUrl && (
                    <>
                      {isVideo(resultMediaUrl) ? (
                        // eslint-disable-next-line jsx-a11y/media-has-caption
                        <video
                          src={resultMediaUrl}
                          controls
                          autoPlay
                          loop
                          className="max-w-full max-h-[480px] object-contain"
                        />
                      ) : isAudio(resultMediaUrl) ? (
                        // eslint-disable-next-line jsx-a11y/media-has-caption
                        <audio src={resultMediaUrl} controls className="w-full px-8" />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={resultMediaUrl} alt="Generated output" className="max-w-full max-h-[480px] object-contain" />
                      )}
                    </>
                  )}

                  {/* Failed state */}
                  {!isRunning && uiStatus === 'failed' && !resultMediaUrl && (
                    <div className="flex flex-col items-center gap-2 text-red-500">
                      <span className="text-3xl">⚠️</span>
                      <p className="text-sm">{errorMsg ?? 'Generation failed'}</p>
                    </div>
                  )}

                  {/* Default / idle state - show CMS preview */}
                  {!isRunning && uiStatus === 'idle' && !resultMediaUrl && (
                    <>
                      {data.previewVideo?.url ? (
                        // eslint-disable-next-line jsx-a11y/media-has-caption
                        <video src={data.previewVideo.url} controls autoPlay loop className="max-w-full max-h-[480px] object-contain" />
                      ) : data.previewImage?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={data.previewImage.url} alt={data.title} className="max-w-full max-h-[480px] object-contain" />
                      ) : data.previewAudio?.url ? (
                        // eslint-disable-next-line jsx-a11y/media-has-caption
                        <audio src={data.previewAudio.url} controls className="w-full px-8" />
                      ) : (
                        <div className="flex flex-col items-center gap-3 text-muted-foreground">
                          <span className="text-4xl">🎬</span>
                          <p className="text-sm">Fill in the inputs and click Run</p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Completed but no extractable URL */}
                  {!isRunning && uiStatus === 'completed' && !resultMediaUrl && (
                    <div className="flex flex-col items-center gap-2 text-green-500">
                      <span className="text-3xl">✅</span>
                      <p className="text-sm">Completed. Check JSON tab for output.</p>
                    </div>
                  )}
                </div>
              )}

              {/* JSON Panel */}
              {resultTab === 'json' && (
                <div className="flex-1 bg-zinc-950 p-4 overflow-auto min-h-[440px]">
                  <div className="space-y-4">
                    {/* Request payload */}
                    <div>
                      <p className="text-xs text-zinc-500 mb-1 font-mono uppercase tracking-wider">Request Payload</p>
                      <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap break-all">
                        {JSON.stringify(currentPayload, null, 2)}
                      </pre>
                    </div>
                    {/* Response */}
                    {apiOutput !== null && (
                      <div>
                        <p className="text-xs text-zinc-500 mb-1 font-mono uppercase tracking-wider">API Response Output</p>
                        <pre className="text-xs text-blue-400 font-mono whitespace-pre-wrap break-all">
                          {JSON.stringify(apiOutput, null, 2)}
                        </pre>
                      </div>
                    )}
                    {jobId && (
                      <div>
                        <p className="text-xs text-zinc-500 mb-1 font-mono uppercase tracking-wider">Job Info</p>
                        <pre className="text-xs text-yellow-400 font-mono">
                          {JSON.stringify({ jobId, status: uiStatus, executionTime: execTime }, null, 2)}
                        </pre>
                      </div>
                    )}
                    {!jobId && !apiOutput && (
                      <p className="text-zinc-500 text-xs font-mono">// Run the model to see JSON output here</p>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* API Tab */}
      {activeTab === 'api' && (
        <div className="max-w-3xl">
          <div className="rounded-xl bg-zinc-950 p-6 overflow-auto">
            <p className="text-xs text-zinc-500 mb-3 font-mono uppercase tracking-wider">JavaScript / Fetch</p>
            <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
{`async function run() {
  // 1. Submit the job
  const submit = await fetch(
    "https://api.runpod.ai/v2/${data.aiApiId}/run",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_API_KEY"
      },
      body: JSON.stringify({
        "input": {
          "prompt": "${prompt || ''}",
          "image": "${imageUrl}",
          "duration": ${duration},
          "enable_prompt_expansion": ${enablePromptExpansion},
          "go_fast": ${goFast}
        }
      })
    }
  )
  const { id } = await submit.json()

  // 2. Poll for result
  let output = null
  while (!output) {
    await new Promise(r => setTimeout(r, 3000))
    const status = await fetch(
      \`https://api.runpod.ai/v2/${data.aiApiId}/status/\${id}\`,
      { headers: { "Authorization": "Bearer YOUR_API_KEY" } }
    )
    const data = await status.json()
    if (data.status === "COMPLETED") output = data.output
    if (["FAILED","CANCELLED"].includes(data.status)) break
  }

  console.log(output)
}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
