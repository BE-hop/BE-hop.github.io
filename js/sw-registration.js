/* ===========================================================
 * sw-registration.js
 * ===========================================================
 * Maintained by liu.ruyuan
 * Licensed under Apache 2.0
 * Register service worker.
 * ========================================================== */

// SW Version Upgrade Ref: <https://youtu.be/Gb9uI67tqV0>

function handleRegistration(registration){
  console.log('Service Worker Registered. ', registration)
  /**
   * ServiceWorkerRegistration.onupdatefound
   * The service worker registration's installing worker changes.
   */
  registration.onupdatefound = (e) => {
    const installingWorker = registration.installing;
    installingWorker.onstatechange = (e) => {
      if (installingWorker.state !== 'installed') return;
      if (navigator.serviceWorker.controller) {
        console.log('SW is updated');
      } else {
        console.log('A Visit without previous SW');
        if (typeof createSnackbar === "function") {
          createSnackbar({
            message: 'App ready for offline use.',
            duration: 3000
          })
        }
      }
    };
  }
}

if(navigator.serviceWorker){
  // For security reasons, a service worker can only control the pages
  // that are in the same directory level or below it. That's why we put sw.js at ROOT level.
  navigator.serviceWorker
    .register('/sw.js')
    .then((registration) => handleRegistration(registration))
    .catch((error) => {console.log('ServiceWorker registration failed: ', error)})

  // register message receiver
  // https://dbwriteups.wordpress.com/2015/11/16/service-workers-part-3-communication-between-sw-and-pages/
  navigator.serviceWorker.onmessage = (e) => {
    console.log('SW: SW Broadcasting:', e);
    const data = e.data
    
    if(data.command == "UPDATE_FOUND"){
      console.log("UPDATE_FOUND_BY_SW", data);
      if (typeof createSnackbar === "function") {
        createSnackbar({
          message: "Content updated.",
          actionText:"refresh",
          action: function(e){location.reload()}
        })
      }
    }
  }

  // When the active controller changes, reload once to ensure latest assets are used.
  let isRefreshing = false
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (isRefreshing) return
    isRefreshing = true
    window.location.reload()
  })
}
