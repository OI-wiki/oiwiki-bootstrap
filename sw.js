/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("workbox-v4.3.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "workbox-v4.3.1"});

workbox.core.setCacheNameDetails({prefix: "gatsby-plugin-offline"});

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "app-f69502830ce9bbf30c86.js"
  },
  {
    "url": "cd5e65d5c4087c4f8496eca72a105a810301cb10-dbaa75925741b8b6376f.js"
  },
  {
    "url": "component---cache-caches-gatsby-plugin-offline-app-shell-js-25e2d83c550c6928fe4b.js"
  },
  {
    "url": "component---node-modules-gatsby-theme-oi-wiki-src-pages-404-tsx-de7ffe4942c70d36af19.js"
  },
  {
    "url": "component---node-modules-gatsby-theme-oi-wiki-src-pages-pages-js-8fc3aa3d8ec3ee5a24d9.js"
  },
  {
    "url": "component---node-modules-gatsby-theme-oi-wiki-src-pages-settings-tsx-887bca24bc3f41f70716.js"
  },
  {
    "url": "component---node-modules-gatsby-theme-oi-wiki-src-pages-tags-js-bae62dbd18df6a95bac2.js"
  },
  {
    "url": "component---node-modules-gatsby-theme-oi-wiki-src-templates-changelog-js-dca4fc1b41b2509c9d84.js"
  },
  {
    "url": "component---node-modules-gatsby-theme-oi-wiki-src-templates-doc-js-495d21b1af14fd82fa16.js"
  },
  {
    "url": "component---node-modules-gatsby-theme-oi-wiki-src-templates-tags-js-0b9a8c2bb0db771c6154.js"
  },
  {
    "url": "framework-3672db66c49131252791.js"
  },
  {
    "url": "idb-keyval-3.2.0-iife.min.js"
  },
  {
    "url": "polyfill-1b0e1fb90f5b2d3ed591.js"
  },
  {
    "url": "script.js"
  },
  {
    "url": "webpack-runtime-af381543b87c2b280f08.js"
  },
  {
    "url": "styles.babd178e636645def37c.css"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "f08e9169286a9f5fdca993c9180c6aec"
  },
  {
    "url": "manifest.webmanifest",
    "revision": "67049a60e3b67c28db901d7ce440468a"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/(\.js$|\.css$)/, new workbox.strategies.CacheFirst(), 'GET');
workbox.routing.registerRoute(/^https?:.*\.(json)$/, new workbox.strategies.NetworkFirst(), 'GET');
workbox.routing.registerRoute(/^https?:.*\.(woff|woff2)$/, new workbox.strategies.StaleWhileRevalidate(), 'GET');
workbox.routing.registerRoute(/^https?:.*\.(png|jpg|jpeg|webp|svg|gif|tiff)$/, new workbox.strategies.NetworkOnly(), 'GET');

/* global importScripts, workbox, idbKeyval */
importScripts(`idb-keyval-3.2.0-iife.min.js`)

const { NavigationRoute } = workbox.routing

let lastNavigationRequest = null
let offlineShellEnabled = true

// prefer standard object syntax to support more browsers
const MessageAPI = {
  setPathResources: (event, { path, resources }) => {
    event.waitUntil(idbKeyval.set(`resources:${path}`, resources))
  },

  clearPathResources: event => {
    event.waitUntil(idbKeyval.clear())
  },

  enableOfflineShell: () => {
    offlineShellEnabled = true
  },

  disableOfflineShell: () => {
    offlineShellEnabled = false
  },
}

self.addEventListener(`message`, event => {
  const { gatsbyApi: api } = event.data
  if (api) MessageAPI[api](event, event.data)
})

function handleAPIRequest({ event }) {
  const { pathname } = new URL(event.request.url)

  const params = pathname.match(/:(.+)/)[1]
  const data = {}

  if (params.includes(`=`)) {
    params.split(`&`).forEach(param => {
      const [key, val] = param.split(`=`)
      data[key] = val
    })
  } else {
    data.api = params
  }

  if (MessageAPI[data.api] !== undefined) {
    MessageAPI[data.api]()
  }

  if (!data.redirect) {
    return new Response()
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: lastNavigationRequest,
    },
  })
}

const navigationRoute = new NavigationRoute(async ({ event }) => {
  // handle API requests separately to normal navigation requests, so do this
  // check first
  if (event.request.url.match(/\/.gatsby-plugin-offline:.+/)) {
    return handleAPIRequest({ event })
  }

  if (!offlineShellEnabled) {
    return await fetch(event.request)
  }

  lastNavigationRequest = event.request.url

  let { pathname } = new URL(event.request.url)
  pathname = pathname.replace(new RegExp(`^`), ``)

  // Check for resources + the app bundle
  // The latter may not exist if the SW is updating to a new version
  const resources = await idbKeyval.get(`resources:${pathname}`)
  if (!resources || !(await caches.match(`/app-f69502830ce9bbf30c86.js`))) {
    return await fetch(event.request)
  }

  for (const resource of resources) {
    // As soon as we detect a failed resource, fetch the entire page from
    // network - that way we won't risk being in an inconsistent state with
    // some parts of the page failing.
    if (!(await caches.match(resource))) {
      return await fetch(event.request)
    }
  }

  const offlineShell = `/offline-plugin-app-shell-fallback/index.html`
  const offlineShellWithKey = workbox.precaching.getCacheKeyForURL(offlineShell)
  return await caches.match(offlineShellWithKey)
})

workbox.routing.registerRoute(navigationRoute)

// this route is used when performing a non-navigation request (e.g. fetch)
workbox.routing.registerRoute(/\/.gatsby-plugin-offline:.+/, handleAPIRequest)
