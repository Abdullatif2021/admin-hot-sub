/* eslint-disable no-console */
import path from 'path'
import {register} from 'register-service-worker'

// if (process.env.NODE_ENV === 'production') {
console.log(`${path.resolve(__dirname, "service-worker-dev.js")}`)
register(`${path.resolve(__dirname, "service-worker-dev.js")}`, {
  ready() {
    console.log(
      'App is being served from cache by a service worker.\n' +
      'For more details, visit https://goo.gl/AFskqB'
    )
  },
  registered() {
    console.log('Service worker has been registered.')
  },
  cached() {
    console.log('Content has been cached for offline use.')
  },
  updatefound() {
    console.log('New content is downloading.')
  },
  updated() {
    console.log('New content is available; please refresh.')
  },
  offline() {
    console.log('No internet connection found. App is running in offline mode.')
  },
  error(error) {
    console.error('Error during service worker registration:', error)
  }
})
// }
