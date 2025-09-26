export const contactDefinition = {
  name: 'Contact Form',
  pages: [
    {
      title: 'Contact Us',
      path: '/contact',
      components: [
        {
          name: 'fullName',
          title: 'Full name',
          type: 'TextField',
          options: {
            classes: 'govuk-input--width-20'
          },
          schema: {
            min: 2,
            max: 100
          },
          validation: {
            required: true
          }
        },
        {
          name: 'email',
          title: 'Email address',
          type: 'EmailAddressField',
          hint: "We'll use this to contact you",
          options: {},
          schema: {},
          validation: {
            required: true
          }
        },
        {
          name: 'subject',
          title: 'Subject',
          type: 'TextField',
          options: {
            classes: 'govuk-input--width-30'
          },
          schema: {
            max: 200
          },
          validation: {
            required: true
          }
        },
        {
          name: 'message',
          title: 'Message',
          type: 'MultilineTextField',
          hint: 'Please provide as much detail as possible',
          options: {
            rows: 8
          },
          schema: {
            max: 2000
          },
          validation: {
            required: true
          }
        }
      ],
      next: [
        {
          path: '/summary'
        }
      ]
    },
    {
      path: '/summary',
      title: 'Check your answers',
      controller: 'SummaryPageController',
      components: [],
      next: [
        {
          path: '/status'
        }
      ]
    }
  ],
  lists: [],
  sections: [],
  conditions: []
}
