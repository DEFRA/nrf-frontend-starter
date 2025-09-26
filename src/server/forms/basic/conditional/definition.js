export const conditionalRoutingDemoDefinition = {
  name: 'Conditional Routing Demo',
  engine: 'V2',
  schema: 2,
  startPage: '/choose-path',
  pages: [
    {
      title: 'Select an option',
      path: '/choose-path',
      components: [
        {
          id: 'aaaa1111-2222-3333-4444-555566667777',
          name: 'choice',
          title: 'Please select an option',
          type: 'RadiosField',
          options: {},
          validation: {
            required: true
          },
          list: '6e96086f-d97e-4085-873f-b77cbf13ebec'
        }
      ],
      next: []
    },
    {
      title: 'Option A',
      path: '/option-a',
      condition: 'dd8c1ec1-c580-4b7c-bb4d-f6bff20fa9ed',
      components: [
        {
          id: 'cccc3333-4444-5555-6666-777788889999',
          name: 'messageA',
          type: 'Html',
          content: '<p class="govuk-body-l">You selected Option A</p>',
          options: {}
        }
      ],
      next: []
    },
    {
      title: 'Option B',
      path: '/option-b',
      condition: 'e09e568c-dd09-4111-a90d-b869c597c8fa',
      components: [
        {
          id: 'dddd4444-5555-6666-7777-888899990000',
          name: 'messageB',
          type: 'Html',
          content: '<p class="govuk-body-l">You selected Option B</p>',
          options: {}
        }
      ],
      next: []
    },
    {
      title: 'Summary',
      path: '/summary',
      controller: 'SummaryPageController',
      components: [],
      next: []
    }
  ],
  lists: [
    {
      id: '6e96086f-d97e-4085-873f-b77cbf13ebec',
      name: 'optionsList',
      title: 'Options',
      type: 'string',
      items: [
        {
          id: 'e4a9bfb4-5643-41d2-aa8d-743ec2f2b45c',
          text: 'Option A',
          value: 'option-a'
        },
        {
          id: '38f5eeb8-724d-4ad1-bcc5-35c4e11c0458',
          text: 'Option B',
          value: 'option-b'
        }
      ]
    }
  ],
  sections: [],
  conditions: [
    {
      id: 'dd8c1ec1-c580-4b7c-bb4d-f6bff20fa9ed',
      displayName: 'Option A selected',
      coordinator: 'and',
      items: [
        {
          id: '724d37a8-7cb1-46c1-bdc8-658bc27adfe6',
          componentId: 'aaaa1111-2222-3333-4444-555566667777',
          operator: 'is',
          type: 'ListItemRef',
          value: {
            itemId: 'e4a9bfb4-5643-41d2-aa8d-743ec2f2b45c',
            listId: '6e96086f-d97e-4085-873f-b77cbf13ebec'
          }
        }
      ]
    },
    {
      id: 'e09e568c-dd09-4111-a90d-b869c597c8fa',
      displayName: 'Option B selected',
      coordinator: 'and',
      items: [
        {
          id: '32b1d68e-61e4-434c-957b-225563ec3172',
          componentId: 'aaaa1111-2222-3333-4444-555566667777',
          operator: 'is',
          type: 'ListItemRef',
          value: {
            itemId: '38f5eeb8-724d-4ad1-bcc5-35c4e11c0458',
            listId: '6e96086f-d97e-4085-873f-b77cbf13ebec'
          }
        }
      ]
    }
  ]
}
