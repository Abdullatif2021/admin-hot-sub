# store

It fully secures the backend connection, in addition to containing all the data circulating in the application and the dependents that handle the operations of data storage, deletion, updating, etc.

**Vuex used as store management**

**getters always start with dash '\_'**

## auction

full CRUD for the auction managment

## block

full managment of the block and its functions :

- general CRUD for the block

- block images

- block videos

- block files

- block metaData

- block youtube videos

- block category managment

- block category metaData

  send data dynamically depend on the language of the application.

  ```js
  payload.info.forEach((el) => {
    formData.append(`${el.name}[title]`, el.title);
    formData.append(`${el.name}[description]`, el.description);
  });
  ```

  Check the image or any other file type so as not to send it null.

  ```js
  if (payload.image) {
    formData.append('path', payload.image);
  }
  ```

## categories

full managment of the auction categories and its functions :

- getCategories

- getCategory

- createCategory

- deleteCategory

- categoryActivate

  change the status of the category.

- getCategoryMetadata

- createCategoryMetadata

- updateCategoryMetadata

- deleteCategoryMetadata

- getCategoryMetaTypeList

## pages

full managment of the page and its functions :

- general CRUD for the page

- page images

- page videos

- page files

- page metaData

- page youtube videos

## settings

Responsible for dynamically bringing the application settings and modifying them

## user

Everything the user can do, such as logging in, changing the password, logging out, changing his preferred language, and modifying his personal account

In addition to a general management of users by the admin and the list of users in it, whether they are admins or regular users.

It also contains the token update function

```js
refreshToken() {
    axios
    .post(`${apiUrl}/auth/refresh_token`, {
        refresh_token: localStorage.getItem("refreshToken")
    })
    .then(
        res => {
        // response.status === 401
        let refreshToken = res.data.refresh_token;
        let accessToken = res.data.access_token;
        setTokens(accessToken, refreshToken);
        },
        _error => {
        console.log(_error);
        router.push("/");
        localStorage.clear();
        }
    );
}
```

## index.js

Responsible for changing the language and updating the page whenever the user does so
