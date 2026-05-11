import type { Block } from 'payload'

export const RunPodEndpoints: Block = {
  slug: 'runpodEndpoints',
  interfaceName: 'RunPodEndpointsBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      defaultValue: 'Public Endpoints',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      defaultValue: 'Browse and deploy from our list of public endpoints.',
    }
  ],
  labels: {
    plural: 'RunPod Endpoints',
    singular: 'RunPod Endpoints',
  },
}
