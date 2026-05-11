import type { Block } from 'payload'

export const ApiFetcher: Block = {
  slug: 'apiFetcher',
  interfaceName: 'ApiFetcherBlock',
  fields: [
    {
      name: 'buttonLabel',
      type: 'text',
      label: 'Button Label',
      required: true,
      defaultValue: 'Fetch Users',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title (Optional)',
    }
  ],
  labels: {
    plural: 'API Fetchers',
    singular: 'API Fetcher',
  },
}
