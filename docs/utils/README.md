# utils

Everything related to verifying the identity of the user and his permissions, in addition to a set of auxiliary functions for the application as a whole

## auth guard

Checks whether the user is authorized to access any link within the application by matching the role of each user with the ones installed on the router links.

get the list of roles from the route that user click.

```js
const roleArrayHierarchic = to.matched
  .filter((x) => x.meta.roles)
  .map((x) => x.meta.roles);
```

Matching the roles between route and user info and complate the route if it is matched.

```js
     if (roleArrayHierarchic.every(x => x.includes(user.role[0]))) {
        console.log(
          "second",
          roleArrayHierarchic.every(x => x.includes(user.role[0]))
        );
        next();
```

send user to unauthorized page if it does not matched.

```js
next('/unauthorized');
```

## index.js

list of helpers :

- getCurrentTime

- ThemeColors

- getDirection

- setDirection

- getThemeColor

- setThemeColor

- getThemeRadius

- setThemeRadius

- getCurrentLanguage

- getAccessToken

- getLanguages

- setCurrentLanguage

- getCurrentUser

- setCurrentUser

- setTokens
