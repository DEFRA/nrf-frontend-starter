import L from 'leaflet'
import 'leaflet-draw'

/**
 * Initialize the map drawing feature
 * This module handles Leaflet map initialization, polygon drawing,
 * and coordinate capture for development site boundaries.
 *
 * Supports state restoration when users navigate back or click "Change"
 */
export function initializeMapDrawing() {
  const mapEl = document.getElementById('map')

  if (!mapEl) {
    return
  }

  console.log('Initializing Leaflet map drawing feature...')

  // Initialize map centered on London
  const map = L.map('map').setView([51.505, -0.09], 13)

  // Add OpenStreetMap tiles
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map)

  // Create a feature group to store drawn items
  const drawnItems = new L.FeatureGroup()
  map.addLayer(drawnItems)

  // Configure drawing control with only polygon option
  const drawControl = new L.Control.Draw({
    draw: {
      polygon: {
        shapeOptions: {
          color: '#d4351c', // GOV.UK red
          weight: 3
        }
      },
      polyline: false,
      rectangle: false,
      circle: false,
      marker: false,
      circlemarker: false
    },
    edit: {
      featureGroup: drawnItems,
      remove: true
    }
  })
  map.addControl(drawControl)

  // Restore existing polygon if user is returning to this page
  const existingData = mapEl.dataset.existingCoordinates
  if (existingData) {
    try {
      const coordinates = JSON.parse(existingData)
      if (coordinates && coordinates.length >= 3) {
        // Convert coordinate objects to Leaflet LatLng objects
        const latlngs = coordinates.map((coord) =>
          L.latLng(parseFloat(coord.lat), parseFloat(coord.lng))
        )

        // Create and add polygon to map
        const polygon = L.polygon(latlngs, {
          color: '#d4351c',
          weight: 3
        })
        drawnItems.addLayer(polygon)

        // Fit map to show the polygon
        map.fitBounds(polygon.getBounds())

        // Update coordinate display
        updateCoordinateInputs(polygon)

        console.log('Restored existing polygon with', coordinates.length, 'points')
      }
    } catch (e) {
      console.error('Failed to restore existing polygon:', e)
    }
  }

  /**
   * Update coordinate inputs when a polygon is drawn or edited
   * @param {L.Layer} layer - The Leaflet layer containing the polygon
   */
  function updateCoordinateInputs(layer) {
    const coordinatesContainer = document.getElementById('coordinates-list')
    const formInput = document.querySelector('input[name="NiAeAB"]')

    if (!coordinatesContainer) return

    // Extract coordinates from polygon
    const latlngs = layer.getLatLngs()[0] // Get first ring of polygon
    const coordinates = latlngs.map((latlng) => ({
      lat: latlng.lat.toFixed(6),
      lng: latlng.lng.toFixed(6)
    }))

    // Update hidden form input with JSON
    if (formInput) {
      formInput.value = JSON.stringify(coordinates)
    }

    // Update visible coordinate display
    coordinatesContainer.innerHTML = coordinates
      .map(
        (coord, index) => `
      <div class="govuk-form-group coordinate-row" style="display: flex; gap: 15px; margin-bottom: 15px;">
        <div style="flex: 1;">
          <label class="govuk-label" for="lat-${index}">
            Point ${index + 1} - Latitude
          </label>
          <input class="govuk-input" id="lat-${index}" type="text" value="${coord.lat}" readonly>
        </div>
        <div style="flex: 1;">
          <label class="govuk-label" for="lng-${index}">
            Point ${index + 1} - Longitude
          </label>
          <input class="govuk-input" id="lng-${index}" type="text" value="${coord.lng}" readonly>
        </div>
      </div>
    `
      )
      .join('')
  }

  /**
   * Clear coordinate inputs
   */
  function clearCoordinateInputs() {
    const coordinatesContainer = document.getElementById('coordinates-list')
    const formInput = document.querySelector('input[name="NiAeAB"]')

    if (coordinatesContainer) coordinatesContainer.innerHTML = ''
    if (formInput) formInput.value = ''
  }

  // Event Handlers

  // Handle polygon creation
  map.on(L.Draw.Event.CREATED, function (e) {
    const layer = e.layer

    // Clear existing drawings (only allow one polygon at a time)
    drawnItems.clearLayers()

    // Add new drawing
    drawnItems.addLayer(layer)

    // Update coordinate inputs
    updateCoordinateInputs(layer)
  })

  // Handle polygon edit
  map.on(L.Draw.Event.EDITED, function (e) {
    e.layers.eachLayer(function (layer) {
      updateCoordinateInputs(layer)
    })
  })

  // Handle polygon deletion
  map.on(L.Draw.Event.DELETED, function () {
    clearCoordinateInputs()
  })

  console.log('Map initialized successfully with drawing controls')
}
