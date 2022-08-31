
    const cacheName = "v1";

    // install service worker
    console.log("Service 33333333333333333333333: installed")
    self.addEventListener("install", (e) => {
        console.log("Service wroker: installed")
    })


    // Call activate event

    self.addEventListener("activate", (e) => {
        console.log("Service wroker: Activated")

        // Deleting old and unwanted cache
        e.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cache => {
                        if (cache !== cacheName) {
                            console.log('Service worker: Clearing Old cache');
                            return caches.delete(cache);
                        }
                    })
                )
            })
        )
    })
    // self.addEventListener("fetch", (event) => {
    //     console.log("Handling fetch event for", event.request.url);
      
    //     event.respondWith(
    //       caches.match(event.request).then((response) => {
    //         if (response) {
    //           console.log("Found response in cache:", response);
      
    //           return response;
    //         }
    //         console.log("No response found in cache. About to fetch from network…");
      
    //         return fetch(event.request).then(
    //           (response) => {
    //             console.log("Response from network is:", response);
      
    //             return response;
    //           },
    //           (error) => {
    //             console.error("Fetching failed:", error);
      
    //             throw error;
    //           }
    //         );
    //       })
    //     );
    //   });

    // Call fetch event

    self.addEventListener('fetch', (e) => {
        console.log('Service worker: Fetching Data');
        e.respondWith(
            fetch(e.request)
                .then(res => {
                    // Make copy/clone of response
                    const resClone = res.clone();
                    caches
                        .open(cacheName)
                        .then(cache => {
                            console.log("Service worker: Caching files")
                            cache.put(e.request, resClone)
                        })
                    return res
                })
                .catch(err => caches.match(e.request).then(res => res))
        )
    })