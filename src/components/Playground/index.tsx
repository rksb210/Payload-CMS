'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

export const Playground: React.FC<{ data: any }> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'playground' | 'api'>('playground')
  const [resultTab, setResultTab] = useState<'preview' | 'json'>('preview')
  
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <span>minimax</span> / <span className="text-foreground font-medium">{data.title}</span>
        </div>
        <p className="text-muted-foreground max-w-3xl">
          {data.description || "Model for AI generation. Animate a reference image with a text prompt."}
        </p>
      </div>

      {/* Main Tabs */}
      <div className="flex gap-6 border-b border-border pb-px">
        <button 
          onClick={() => setActiveTab('playground')}
          className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'playground' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-45"><path d="m12 2 3.5 3.5L12 9l-3.5-3.5L12 2Z"/><path d="m18 8 3.5 3.5L18 15l-3.5-3.5L18 8Z"/><path d="m12 14 3.5 3.5L12 21l-3.5-3.5L12 14Z"/><path d="m6 8 3.5 3.5L6 15 2.5 11.5 6 8Z"/></svg>
          Playground
        </button>
        <button 
          onClick={() => setActiveTab('api')}
          className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'api' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
          API
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Input */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Input</h3>
            <Button variant="outline" size="sm" className="text-xs h-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
              Request logs
            </Button>
          </div>

          <div className="space-y-6">
            {data.inputFields && data.inputFields.length > 0 ? (
              data.inputFields.map((field: any, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <label className="font-medium">{field.label || field.name}</label>
                  </div>
                  
                  {field.type === 'textarea' && (
                    <Textarea 
                      placeholder={`Enter ${field.label || field.name}...`} 
                      className="min-h-[120px] resize-none" 
                    />
                  )}
                  
                  {field.type === 'select' && (
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" className="px-4 text-xs">Option 1</Button>
                      <Button variant="outline" size="sm" className="px-4 text-xs">Option 2</Button>
                    </div>
                  )}
                  
                  {field.type === 'file' && (
                    <div className="p-6 border border-dashed border-border rounded-xl bg-muted/30 flex flex-col items-center gap-3 cursor-pointer hover:bg-muted/50 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <div className="text-xs text-muted-foreground">Upload {field.label || field.name}</div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <label className="font-medium">Prompt</label>
                    <span className="text-muted-foreground italic">Required</span>
                  </div>
                  <Textarea placeholder="Enter your prompt here..." className="min-h-[150px] resize-none" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration</label>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="px-4">6s</Button>
                    <Button variant="outline" size="sm" className="px-4">10s</Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Duration in seconds</p>
                </div>
              </>
            )}

            <div className="p-4 border border-border rounded-lg flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors">
              <span className="text-sm font-medium">Additional settings</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
            
            <div className="flex items-center gap-2 text-green-500 font-medium text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              {data.pricing || "$0.19 per second"}
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <Button variant="secondary" className="flex-1">Reset</Button>
            <Button className="flex-1 bg-primary text-primary-foreground hover:opacity-90">Run</Button>
          </div>
        </div>

        {/* Right Column - Result */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">Result</h3>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 uppercase">
                <span className="h-1 w-1 rounded-full bg-blue-500" />
                Idle
              </span>
            </div>
          </div>

          <Card className="flex-1 min-h-[500px] border-border overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-2 border-b border-border bg-muted/20">
              <div className="flex gap-1">
                <Button 
                  variant={resultTab === 'preview' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  className="h-8 text-xs"
                  onClick={() => setResultTab('preview')}
                >
                  Preview
                </Button>
                <Button 
                  variant={resultTab === 'json' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  className="h-8 text-xs"
                  onClick={() => setResultTab('json')}
                >
                  JSON
                </Button>
              </div>
              {/* <Button variant="outline" size="sm" className="h-8 text-xs opacity-50 cursor-not-allowed">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download video
              </Button> */}
            </div>
            
            <div className="flex-1 flex items-center justify-center bg-black/5 relative group">
              {/* Dynamic Image from CMS */}
              {data.previewImage?.url ? (
                <img 
                  src={data.previewImage.url} 
                  alt={data.title} 
                  className="max-w-full h-auto object-contain"
                />
              ) : (
                <div className="text-muted-foreground text-sm italic">No preview image uploaded</div>
              )}
              {/* <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4 text-white/80 bg-black/40 backdrop-blur-md p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                 <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                   <div className="w-0 h-full bg-primary" />
                 </div>
                 <span className="text-xs font-mono">0:00 / 0:05</span>
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h.01"/><path d="M2 10V6a2 2 0 0 1 2-2h4"/><path d="m2 14 2 1.2a2 2 0 0 0 2 0L8 14"/><path d="M20 14l-2 1.2a2 2 0 0 1-2 0L14 14"/><path d="M22 10V6a2 2 0 0 0-2-2h-4"/></svg>
              </div> */}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
