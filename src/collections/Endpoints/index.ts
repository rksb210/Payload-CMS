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
                    { label: 'Textarea', value: 'textarea' },
                    { label: 'Select', value: 'select' },
                    { label: 'File/Image', value: 'file' },
                  ],
                  required: true,
                },
                {
                  name: 'label',
                  type: 'text',
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
    slugField('title'),
  ],
}
