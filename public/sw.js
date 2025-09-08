// Service Worker untuk caching static assets
const CACHE_NAME = 'indomusika-v2'
const STATIC_CACHE = 'indomusika-static-v2'
const AUDIO_CACHE = 'indomusika-audio-v2'
const IMAGE_CACHE = 'indomusika-images-v2'
const AVATAR_CACHE = 'indomusika-avatars-v2'

// Assets yang akan di-cache
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  // Add other static assets here
]

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== AUDIO_CACHE && 
              cacheName !== IMAGE_CACHE && 
              cacheName !== AVATAR_CACHE) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Cache strategy untuk audio files
  if (request.destination === 'audio' || url.pathname.match(/\.(mp3|wav|m4a|ogg)$/)) {
    event.respondWith(
      caches.open(AUDIO_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            return response
          }
          
          return fetch(request).then((fetchResponse) => {
            // Only cache successful responses
            if (fetchResponse.status === 200) {
              cache.put(request, fetchResponse.clone())
            }
            return fetchResponse
          })
        })
      })
    )
    return
  }

  // Cache strategy untuk images
  if (request.destination === 'image') {
    // Check if it's an avatar image
    const isAvatar = url.pathname.includes('/avatar/') || url.pathname.includes('avatar')
    const cacheName = isAvatar ? AVATAR_CACHE : IMAGE_CACHE
    
    event.respondWith(
      caches.open(cacheName).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            return response
          }
          
          return fetch(request).then((fetchResponse) => {
            if (fetchResponse.status === 200) {
              cache.put(request, fetchResponse.clone())
            }
            return fetchResponse
          })
        })
      })
    )
    return
  }

  // Cache strategy untuk static assets
  if (url.origin === location.origin) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            return response
          }
          
          return fetch(request).then((fetchResponse) => {
            if (fetchResponse.status === 200) {
              cache.put(request, fetchResponse.clone())
            }
            return fetchResponse
          })
        })
      })
    )
  }
})
