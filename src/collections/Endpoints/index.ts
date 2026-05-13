import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const Endpoints: CollectionConfig = {
  slug: 'endpoints',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'aiApiId',
      type: 'text',
      label: 'RunPod AI API ID',
      required: true,
      admin: {
        description: 'The model ID from RunPod (e.g. minimax-hailuo-2-3-fast)',
      },
    },
    {
      name: 'runpodApiKey',
      type: 'text',
      label: 'RunPod API Key',
      required: true,
      admin: {
        description: 'Your RunPod API key (Bearer token). This is stored securely and never sent to the client.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'RunPod Input Defaults',
          description: 'Default values that pre-fill the playground input fields. Users can change these before running.',
          fields: [
            {
              name: 'pricing',
              type: 'text',
              label: 'Pricing Label',
              defaultValue: '$0.19 per second',
            },
            {
              name: 'defaultPrompt',
              type: 'textarea',
              label: 'Default Prompt',
              admin: {
                description: 'Default prompt text. Can be left empty.',
              },
            },
            {
              name: 'defaultImage',
              type: 'text',
              label: 'Default Image URL',
              defaultValue: 'https://image.runpod.ai/assets/minimax/hailuo-2-3-fast.jpeg',
              admin: {
                description: 'Default image URL to animate. Users can change this in the playground.',
              },
            },
            {
              name: 'defaultDuration',
              type: 'select',
              label: 'Default Duration (seconds)',
              defaultValue: '6',
              options: [
                { label: '6 seconds', value: '6' },
                { label: '10 seconds', value: '10' },
              ],
              admin: {
                description: 'Default video duration in seconds.',
              },
            },
            {
              name: 'defaultEnablePromptExpansion',
              type: 'checkbox',
              label: 'Enable Prompt Expansion by default',
              defaultValue: true,
              admin: {
                description: 'Automatically enhance the prompt using AI.',
              },
            },
            {
              name: 'defaultGoFast',
              type: 'checkbox',
              label: 'Go Fast by default',
              defaultValue: true,
              admin: {
                description: 'Use faster generation mode.',
              },
            },
          ],
        },
        {
          label: 'Legacy Input Fields',
          fields: [
            {
              name: 'inputFields',
              type: 'array',
              label: 'Custom Playground Input Fields (Legacy)',
              admin: {
                description: 'Legacy custom fields. Use RunPod Input Defaults tab instead for RunPod endpoints.',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'type',
                  type: 'select',
                  options: [
                    { label: 'Short Text', value: 'input' },
                    { label: 'Textarea', value: 'textarea' },
                    { label: 'Select', value: 'select' },
                    { label: 'Checkbox', value: 'checkbox' },
                    { label: 'File/Image', value: 'file' },
                    { label: 'Video', value: 'video' },
                    { label: 'Audio', value: 'audio' },
                  ],
                  required: true,
                },
                {
                  name: 'label',
                  type: 'text',
                },
                {
                  name: 'defaultValue',
                  type: 'text',
                },
                {
                  name: 'options',
                  type: 'array',
                  label: 'Select Options',
                  admin: {
                    condition: (data, siblingData) => siblingData.type === 'select',
                  },
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'value',
                      type: 'text',
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'API Details',
          fields: [
            {
              name: 'apiDocs',
              type: 'richText',
            },
          ],
        },
      ],
    },
    {
      name: 'previewImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Preview Image (Right Side)',
    },
    {
      name: 'previewVideo',
      type: 'upload',
      relationTo: 'media',
      label: 'Preview Video (Right Side)',
    },
    {
      name: 'previewAudio',
      type: 'upload',
      relationTo: 'media',
      label: 'Preview Audio (Right Side)',
    },
    slugField(),
  ],
}
