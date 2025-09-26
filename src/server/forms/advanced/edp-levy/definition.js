export const edpLevyDefinition = {
  engine: 'V2',
  schema: 2,
  name: 'EDP Levy Calculator',
  startPage: '/start',
  sections: [],
  pages: [
    {
      title: 'Start',
      path: '/start',
      components: [
        {
          id: 'ffffffff-0000-1111-2222-333344445555',
          type: 'Html',
          content:
            '<h1 class="govuk-heading-l">Environmental Development Plan Levy</h1><p class="govuk-body">Use this service to calculate and pay your Environmental Development Plan (EDP) levy for new housing developments.</p><p class="govuk-body">You will need:</p><ul class="govuk-list govuk-list--bullet"><li>your development site location</li><li>the number of houses you plan to build</li><li>your company details</li></ul><p class="govuk-body">The levy is calculated at £2,500 per house.</p>'
        }
      ],
      next: [{ path: '/location-method' }]
    },
    {
      title: 'How would you like to provide your development site location?',
      path: '/location-method',
      components: [
        {
          id: 'ad60f50d-293f-47d1-ae85-fc4d9ece9baf',
          name: 'locationMethod',
          title:
            'How would you like to provide your development site location?',
          type: 'RadiosField',
          hint: 'Choose the method that works best for you. You can upload a file with your development boundary, enter a postcode, provide coordinates, or draw on a map.',
          options: {
            itemHintClass: 'govuk-radios__hint'
          },
          validation: {
            required: true
          },
          list: 'b2c3d4e5-f6a7-8901-bcde-f23456789012'
        }
      ],
      next: [
        {
          path: '/upload-boundary',
          condition: 'aaaaaaaa-1111-2222-3333-444444444444'
        },
        {
          path: '/enter-postcode',
          condition: 'cccccccc-1111-2222-3333-444444444444'
        },
        {
          path: '/enter-coordinates',
          condition: 'eeeeeeee-1111-2222-3333-444444444444'
        },
        { path: '/draw-map', condition: '00000000-1111-2222-3333-444444444444' }
      ]
    },
    {
      title: 'Upload a boundary file',
      path: '/upload-boundary',
      condition: 'aaaaaaaa-1111-2222-3333-444444444444',
      components: [
        {
          id: 'c3d4e5f6-a7b8-9012-cdef-345678901234',
          name: 'boundaryFile',
          title: 'Upload your boundary file',
          type: 'FileUploadField',
          hint: 'Upload a shape file (.shp), KML file (.kml), or GeoJSON file (.geojson) containing your development boundary',
          options: {
            required: false,
            multiple: false,
            accept: '.shp,.kml,.geojson'
          },
          validation: {
            required: true
          }
        }
      ],
      next: [{ path: '/details' }]
    },
    {
      title: 'What is the postcode of your development?',
      path: '/enter-postcode',
      condition: 'cccccccc-1111-2222-3333-444444444444',
      components: [
        {
          id: 'd4e5f6a7-b8c9-0123-defa-456789012345',
          name: 'postcode',
          title: 'Enter a postcode',
          type: 'TextField',
          hint: 'For example, SW1A 2AA',
          options: {
            classes: 'govuk-input--width-10',
            autocomplete: 'postal-code'
          },
          schema: {
            max: 10,
            trim: true
          },
          validation: {
            required: true,
            messages: {
              'any.required': 'Enter a postcode'
            }
          }
        }
      ],
      next: [{ path: '/details' }]
    },
    {
      title: 'Enter coordinates',
      path: '/enter-coordinates',
      condition: 'eeeeeeee-1111-2222-3333-444444444444',
      components: [
        {
          id: 'e5f6a7b8-c9d0-1234-efab-567890123456',
          name: 'latitude',
          title: 'Latitude',
          type: 'NumberField',
          hint: 'For example, 51.5074',
          options: {
            classes: 'govuk-input--width-10'
          },
          schema: {
            min: -90,
            max: 90,
            precision: 6
          },
          validation: {
            required: true,
            messages: {
              'number.base': 'Latitude must be a valid number',
              'number.min': 'Latitude must be between -90 and 90',
              'number.max': 'Latitude must be between -90 and 90',
              'any.required': 'Enter the latitude coordinate'
            }
          }
        },
        {
          id: 'f6a7b8c9-d0e1-2345-fabc-678901234567',
          name: 'longitude',
          title: 'Longitude',
          type: 'NumberField',
          hint: 'For example, -0.1278',
          options: {
            classes: 'govuk-input--width-10'
          },
          schema: {
            min: -180,
            max: 180,
            precision: 6
          },
          validation: {
            required: true,
            messages: {
              'number.base': 'Longitude must be a valid number',
              'number.min': 'Longitude must be between -180 and 180',
              'number.max': 'Longitude must be between -180 and 180',
              'any.required': 'Enter the longitude coordinate'
            }
          }
        }
      ],
      next: [{ path: '/details' }]
    },
    {
      title: 'Draw on map',
      path: '/draw-map',
      condition: '00000000-1111-2222-3333-444444444444',
      components: [
        {
          id: 'a7b8c9d0-e1f2-3456-abcd-789012345678',
          name: 'mapPlaceholder',
          type: 'Html',
          content: `
            <div class="govuk-notification-banner" role="region" aria-labelledby="govuk-notification-banner-title" data-module="govuk-notification-banner">
              <div class="govuk-notification-banner__header">
                <h2 class="govuk-notification-banner__title" id="govuk-notification-banner-title">
                  Important
                </h2>
              </div>
              <div class="govuk-notification-banner__content">
                <p class="govuk-notification-banner__heading">
                  Map functionality coming soon
                </p>
                <p class="govuk-body">The interactive map feature is currently under development. Please use one of the other location options.</p>
              </div>
            </div>

            <div style="height: 400px; border: 2px dashed #b1b4b6; background-color: #f3f2f1; display: flex; align-items: center; justify-content: center;">
              <div style="text-align: center;">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#505a5f"/>
                </svg>
                <p class="govuk-body-l govuk-!-margin-top-2">Map placeholder</p>
                <p class="govuk-body-s">Interactive map will be available here</p>
              </div>
            </div>
          `,
          options: {}
        }
      ],
      next: [{ path: '/details' }]
    },
    {
      title: 'Tell us about your development',
      path: '/details',
      components: [
        {
          id: 'b8c9d0e1-f2a3-4567-bcde-890123456789',
          name: 'developmentName',
          title: 'What is the name of your development?',
          type: 'TextField',
          hint: 'This will be used to identify your application',
          options: {
            classes: 'govuk-input--width-20'
          },
          validation: {
            required: true
          }
        },
        {
          id: 'c9d0e1f2-a3b4-5678-cdef-901234567890',
          name: 'numberOfHouses',
          title: 'How many houses will be built?',
          type: 'NumberField',
          hint: 'Enter the total number of residential units',
          options: {
            classes: 'govuk-input--width-5'
          },
          schema: {
            min: 1,
            max: 10000
          },
          validation: {
            required: true,
            messages: {
              'number.base': 'Enter the number of houses',
              'number.min': 'Number must be at least 1',
              'number.max': 'Number cannot exceed 10000',
              'any.required': 'Enter the number of houses'
            }
          }
        },
        {
          id: 'd0e1f2a3-b4c5-6789-defa-012345678901',
          name: 'developmentType',
          title: 'What type of development is this?',
          type: 'RadiosField',
          options: {},
          validation: {
            required: true
          },
          list: 'e1f2a3b4-c5d6-7890-efab-123456789012'
        },
        {
          id: 'e1f2a3b4-c5d6-7890-fabc-234567890123',
          name: 'wastewaterTreatment',
          title:
            'Which wastewater treatment works will serve this development?',
          type: 'RadiosField',
          hint: 'If you are not sure, select "Other/Unknown"',
          options: {},
          validation: {
            required: true
          },
          list: 'f2a3b4c5-d6e7-8901-abcd-345678901234'
        }
      ],
      next: [{ path: '/edp-check' }]
    },
    {
      title: 'Environmental Development Plan boundaries',
      path: '/edp-check',
      components: [
        {
          id: 'f2a3b4c5-d6e7-8901-bcde-456789012345',
          name: 'edpCheckResult',
          type: 'Html',
          content: `
            <p class="govuk-body-l">Based on your location, your development falls within the following Environmental Development Plan boundaries:</p>

            <div class="govuk-inset-text">
              <h3 class="govuk-heading-s">Your development is affected by:</h3>
              <ul class="govuk-list govuk-list--bullet">
                <li><strong>District Level Licensing (DLL)</strong> - Great Crested Newts</li>
                <li><strong>Nutrient Mitigation</strong> - Nitrogen reduction</li>
              </ul>
            </div>

            <p class="govuk-body">You will need to pay levies for these environmental impacts as part of your development.</p>
          `,
          options: {}
        },
        {
          id: 'a3b4c5d6-e7f8-9012-cdef-567890123456',
          name: 'edpType',
          title: 'Select the primary EDP type for levy calculation',
          type: 'RadiosField',
          hint: 'The levy will be calculated based on the primary environmental impact',
          options: {},
          validation: {
            required: true
          },
          list: 'a3b4c5d6-e7f8-9012-defa-678901234567'
        }
      ],
      next: [{ path: '/summary' }]
    },
    {
      title: 'Check your answers',
      path: '/summary',
      controller: 'SummaryPageController',
      components: [],
      next: [{ path: '/confirmation' }]
    },
    {
      title: 'Application submitted',
      path: '/confirmation',
      components: [
        {
          id: 'b4e5f6a7-8901-2345-cdef-012345678901',
          type: 'Html',
          content: `
            <script>
              // Redirect to custom confirmation page
              window.location.href = '/edp-levy/confirmation';
            </script>
            <p class="govuk-body">Redirecting to confirmation page...</p>
            <p class="govuk-body">If you are not redirected, <a href="/edp-levy/confirmation" class="govuk-link">click here</a>.</p>
          `
        }
      ],
      next: []
    }
  ],
  lists: [
    {
      id: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
      name: 'locationMethodList',
      title: 'Location method',
      type: 'string',
      items: [
        {
          id: '11111111-2222-3333-4444-555555555555',
          text: 'Upload a boundary file',
          value: 'upload',
          hint: {
            text: 'Upload a shape file (.shp), KML file (.kml), or GeoJSON file (.geojson) containing your development boundary'
          }
        },
        {
          id: '22222222-3333-4444-5555-666666666666',
          text: 'Enter a postcode',
          value: 'postcode',
          hint: {
            text: 'Enter the postcode of your development site and area file boundary on a map'
          }
        },
        {
          id: '33333333-4444-5555-6666-777777777777',
          text: 'Enter coordinates',
          value: 'coordinates',
          hint: {
            text: 'Enter the latitude and longitude coordinates of your development site and area file boundary on a map'
          }
        },
        {
          id: '44444444-5555-6666-7777-888888888888',
          text: 'Draw on a map',
          value: 'draw',
          hint: {
            text: 'Draw on map outline map to locate and draw your development boundary'
          }
        }
      ]
    },
    {
      id: 'e1f2a3b4-c5d6-7890-efab-123456789012',
      name: 'developmentTypeList',
      title: 'Development type',
      type: 'string',
      items: [
        {
          id: '55555555-6666-7777-8888-999999999999',
          text: 'Residential',
          value: 'residential'
        },
        {
          id: '66666666-7777-8888-9999-aaaaaaaaaaaa',
          text: 'Commercial',
          value: 'commercial'
        },
        {
          id: '77777777-8888-9999-aaaa-bbbbbbbbbbbb',
          text: 'Mixed use',
          value: 'mixed'
        },
        {
          id: '88888888-9999-aaaa-bbbb-cccccccccccc',
          text: 'Industrial',
          value: 'industrial'
        }
      ]
    },
    {
      id: 'f2a3b4c5-d6e7-8901-abcd-345678901234',
      name: 'wastewaterList',
      title: 'Wastewater treatment',
      type: 'string',
      items: [
        {
          id: '99999999-aaaa-bbbb-cccc-dddddddddddd',
          text: 'Budds Farm WwTW',
          value: 'budds-farm'
        },
        {
          id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
          text: 'Peel Common WwTW',
          value: 'peel-common'
        },
        {
          id: 'bbbbbbbb-cccc-dddd-eeee-ffffffffffff',
          text: 'Woolston WwTW',
          value: 'woolston'
        },
        {
          id: 'cccccccc-dddd-eeee-ffff-000000000000',
          text: 'Millbrook WwTW',
          value: 'millbrook'
        },
        {
          id: 'dddddddd-eeee-ffff-0000-111111111111',
          text: 'Other/Unknown',
          value: 'other'
        }
      ]
    },
    {
      id: 'a3b4c5d6-e7f8-9012-defa-678901234567',
      name: 'edpTypeList',
      title: 'EDP type',
      type: 'string',
      items: [
        {
          id: 'eeeeeeee-ffff-0000-1111-222222222222',
          text: 'District Level Licensing (DLL)',
          value: 'dll'
        },
        {
          id: 'ffffffff-0000-1111-2222-333333333333',
          text: 'Nutrient Mitigation',
          value: 'nutrient'
        }
      ]
    }
  ],
  conditions: [
    {
      id: 'aaaaaaaa-1111-2222-3333-444444444444',
      displayName: 'Upload selected',
      coordinator: 'and',
      items: [
        {
          id: 'bbbbbbbb-1111-2222-3333-444444444444',
          componentId: 'ad60f50d-293f-47d1-ae85-fc4d9ece9baf',
          operator: 'is',
          type: 'ListItemRef',
          value: {
            itemId: '11111111-2222-3333-4444-555555555555',
            listId: 'b2c3d4e5-f6a7-8901-bcde-f23456789012'
          }
        }
      ]
    },
    {
      id: 'cccccccc-1111-2222-3333-444444444444',
      displayName: 'Postcode selected',
      coordinator: 'and',
      items: [
        {
          id: 'dddddddd-1111-2222-3333-444444444444',
          componentId: 'ad60f50d-293f-47d1-ae85-fc4d9ece9baf',
          operator: 'is',
          type: 'ListItemRef',
          value: {
            itemId: '22222222-3333-4444-5555-666666666666',
            listId: 'b2c3d4e5-f6a7-8901-bcde-f23456789012'
          }
        }
      ]
    },
    {
      id: 'eeeeeeee-1111-2222-3333-444444444444',
      displayName: 'Coordinates selected',
      coordinator: 'and',
      items: [
        {
          id: 'ffffffff-1111-2222-3333-444444444444',
          componentId: 'ad60f50d-293f-47d1-ae85-fc4d9ece9baf',
          operator: 'is',
          type: 'ListItemRef',
          value: {
            itemId: '33333333-4444-5555-6666-777777777777',
            listId: 'b2c3d4e5-f6a7-8901-bcde-f23456789012'
          }
        }
      ]
    },
    {
      id: '00000000-1111-2222-3333-444444444444',
      displayName: 'Draw selected',
      coordinator: 'and',
      items: [
        {
          id: '11111111-1111-2222-3333-444444444444',
          componentId: 'ad60f50d-293f-47d1-ae85-fc4d9ece9baf',
          operator: 'is',
          type: 'ListItemRef',
          value: {
            itemId: '44444444-5555-6666-7777-888888888888',
            listId: 'b2c3d4e5-f6a7-8901-bcde-f23456789012'
          }
        }
      ]
    }
  ]
}
