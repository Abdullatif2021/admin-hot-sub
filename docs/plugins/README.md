# Plugins

Axios plugin

# main function

Responsible for monitoring requests and adding the token to each request while it is being sent.

```js
axios.interceptors.request.use((request) => {
  request.headers = {
    Authorization: 'Bearer ' + getAccessToken(),
    // locale: getCurrentLanguage()
  };
  return request;
});
```

# another function

It is also responsible for monitoring the time period of the access token during the process of calling the backend to replace it through the fresh token in the event of its expiry date and re-installation in the local storage

```js
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  function(error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      store.dispatch('refreshToken');
      setTimeout(() => {
        axios.request(error.config);
      }, 1000);
      setTimeout(() => {
        location.reload();
      }, 2000);
    }
  }
);
```
