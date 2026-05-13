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
        description: 'The ID from RunPod API (e.g. minimax-hailuo-2-3-fast)',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Input Settings',
          fields: [
            {
              name: 'pricing',
              type: 'text',
              label: 'Pricing Label',
              defaultValue: '$0.19 per second',
            },
            {
              name: 'inputFields',
              type: 'array',
              label: 'Playground Input Fields',
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
            }
          ]
        }
      ]
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
    slugField('title'),
  ],
}
