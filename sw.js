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
    "url": "31-45479f9329baeebf13eb.js"
  },
  {
    "url": "8a28b14e-709bd4bce22dc8c68f99.js"
  },
  {
    "url": "8e1315a6a9c758c7d371a31b80e7566df6774f1e-147013de7816c097082f.js"
  },
  {
    "url": "app-c018caf7c97766389fee.js"
  },
  {
    "url": "component---cache-caches-gatsby-plugin-offline-app-shell-js-ea9463c3a24c45320c10.js"
  },
  {
    "url": "component---node-modules-gatsby-theme-oi-wiki-src-pages-404-tsx-9411407c6a3a72511e8c.js"
  },
  {
    "url": "component---node-modules-gatsby-theme-oi-wiki-src-pages-pages-tsx-fbc92086d950d7b504a4.js"
  },
  {
    "url": "component---node-modules-gatsby-theme-oi-wiki-src-pages-play-tsx-051bc34774d292bc4cd6.js"
  },
  {
    "url": "component---node-modules-gatsby-theme-oi-wiki-src-pages-settings-tsx-8ff987fc202348120ecf.js"
  },
  {
    "url": "component---node-modules-gatsby-theme-oi-wiki-src-pages-tags-tsx-529276001c1fba365bac.js"
  },
  {
    "url": "component---node-modules-gatsby-theme-oi-wiki-src-templates-changelog-js-4ddeea9589a697dd0a89.js"
  },
  {
    "url": "component---node-modules-gatsby-theme-oi-wiki-src-templates-doc-js-dee4bcf9e2735676715a.js"
  },
  {
    "url": "component---node-modules-gatsby-theme-oi-wiki-src-templates-tags-js-d0a2a8a8cfb1b891e976.js"
  },
  {
    "url": "dc6a8720040df98778fe970bf6c000a41750d3ae-a0f5484cf34d63ae72f3.js"
  },
  {
    "url": "framework-1ddacdf29b5c83f1dd8b.js"
  },
  {
    "url": "idb-keyval-3.2.0-iife.min.js"
  },
  {
    "url": "polyfill-8e5e2389900b9f771815.js"
  },
  {
    "url": "script.js"
  },
  {
    "url": "webpack-runtime-3311af84608ba4d29f89.js"
  },
  {
    "url": "styles.65f1691cd8e645685777.css"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "5739b79467909c0fb9345983ae1c3898"
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
  if (!resources || !(await caches.match(`/app-c018caf7c97766389fee.js`))) {
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
