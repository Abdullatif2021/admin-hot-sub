if ('serviceWorker' in navigator) {
  window.addEventListener('install', function() {
    navigator.serviceWorker.register('service_worker.js', {
      scope: '/',
    }).then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope');
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}


// navigator.serviceWorker
//             .register("service_worker.js", {
//     scope: '/' }).then(function (registration) {
//     var serviceWorker;
//     if (registration.installing) {
//         serviceWorker = registration.installing;
//         console.log('installing');
//     } else if (registration.waiting) {
//         serviceWorker = registration.waiting;
//         console.log('waiting');
//     } else if (registration.active) {
//         serviceWorker = registration.active;
//         console.log('active');
//     }
//     if (serviceWorker) {
//         // logState(serviceWorker.state);
//         serviceWorker.addEventListener('statechange', function (e) {
//             // logState(e.target.state);
//         });
//     }
// }).catch(err =>{console.log('ServiceWorker registration failed: ', err);})