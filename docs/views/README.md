# views

It contains all the pages that the user can interact with easily

**vuetable 2.0 used for all tables in the UI**

**vue2-dropzone used for upload file, images and videos**

**VuetablePaginationBootstrap used for pagination**

**vuelidate used for form validation**

**mapGetters, mapActions used for interact with vuex store**

## general functions

dynamic form loop through site languages to let user insert data for all languages available in the app

```js
<div v-for="(lang, index) in $v.meta_form.$each.$iter" :key="index" >
      <b-form-group
        :label="$t(`forms.${lang.name.$model}_content`)"
        class="has-float-label mb-4"
      >
        <b-form-input
          type="text"
          v-model="lang.content.$model"
          :state="!lang.content.$error"
        />
        <b-form-invalid-feedback
          v-if="!lang.content.required"
          >Please enter content</b-form-invalid-feedback
        >
      </b-form-group>
</div>


{
mixins: [validationMixin],
  validations: {
    meta_form: {
      $each: {
        content: {
          required
        },
        name: {}
      }
    },
  }
}
```

this function is called in the initializ of the component to create the dynamic form.

```js


    this.make_collaction(this.langs, this.meta_form);


    make_collaction(langs, form) {
          console.log(langs, form);
          JSON.parse(langs).forEach(el => {
            form.push({
              content: "",
              name: el.name
            });
          });
          console.log("meta_form", this.meta_form);
        },
```

set data each time page or page size is changed

```js
  onPaginationData(paginationData) {
      this.from = paginationData.from;
      this.to = paginationData.to;
      this.total = paginationData.total;
      this.lastPage = paginationData.last_page;
      this.items = paginationData.data;
      this.$refs.pagination.setPaginationData(paginationData);
    }
```

used for sorting with the name of the filed and the direction.

```js
    dataManager(sortOrder, pagination) {
      if (sortOrder.length > 0) {
        console.log("orderBy:", sortOrder[0].sortField, sortOrder[0].direction);
        if (sortOrder[0].direction == "asc") {
          this.order_by = sortOrder[0].sortField;
          this.dir = "ASC";
          this.get...List({
            sorting: true,
            type: this.sort.column,
            dir: this.dir,
            search: this.search,
            order_by: this.order_by,
            limit: this.limit,
            page: this.page
          });
        }
        if (sortOrder[0].direction == "desc") {
          this.order_by = sortOrder[0].sortField;
          this.dir = "DESC";
          this.get...List({
            sorting: true,
            type: this.sort.column,
            dir: this.dir,
            search: this.search,
            order_by: this.order_by,
            limit: this.limit,
            page: this.page
          });
        }
      }
    }
```

send request whenever user change the page from page list

```js
    onChangePage(page) {
      if (page == "next" || page == "prev") {
        console.log(page);
      } else {
        this.page = page;
        this.get...List({
          type: this.sort.column,
          dir: this.dir,
          search: this.search,
          order_by: this.order_by,
          limit: this.limit,
          page: this.page
        });
      }
    }
```

send request whenever user change the page size

```js
    changePageSize(perPage) {
      console.log(perPage);
      this.limit = perPage;
      this.get...List({
        type: this.sort.column,
        dir: this.dir,
        search: this.search,
        order_by: this.order_by,
        limit: this.limit,
        page: this.page
      });
    }
```

send request each time search is changed.

```js
    searchChange(val) {
      console.log(val);
      this.search = val;
      this.get...List({
        type: this.sort.column,
        dir: this.dir,
        search: val,
        order_by: this.order_by,
        limit: this.limit,
        page: this.page
      });
    },
```

enable and disable loader depending on prossing getters

````js
  <template v-if="_isLoad...">

  </template>
  <template v-else>
     <div class="loading"></div>
  </template>
``` -->

<!-- ## auction

- list of auctions

- auction details

## block

- block list

- list of blocks depending on block categories send from the backend

- block attachment

- responsible for images, videos, files and youtube videos.

- block

responsible for basic details of the block main image, title in each language, main file, url, category, date of post and activation also the metaData of block.

epmty the form

```js
this.form.forEach((el) => {
  el.title = null;
  el.description = null;
});
````

## block categories

- categories list
  list of block categories.

- block category
  check the id of the blcok category to display its details.
  or create new one

  ```js

  <template>
  <b-colxx xxs="12" xs="12" lg="12" class="mb-3">
    <datatable-heading
      :details="true"
      :reload="true"
      :title="id ? $t('edit_block') : $t('create_block')"
    ></datatable-heading>

  <category_details v-if="id" :_id="id" :_type="blockCategory" />
  <add_category v-if="!id" :_type="blockCategory" />
    </b-colxx>
  </template>

  ```

## auction categories

- categories list
  list of auction categories.

- category
  check the id of the category to display its details.
  or create new one

```js
<template>
<b-row>
  <b-colxx xxs="12" xs="12" lg="12" class="mb-3">
    <datatable-heading
      :details="true"
      :reload="true"
      :title="id ? $t('edit_category') : $t('create_category')"
    ></datatable-heading>
    <category_details v-if="id" :_id="id" :_type="category" />
    <add_category v-if="!id" :_type="category" />
  </b-colxx>
</b-row>
</template>

```

## pages

- pages list

  - pages list

  - page

    - page details :

      - page image

      - page title

      - page description

      - page link 1 and link 2

      - page type

    - page meta data :

      - list of meta data

      - dynamic form to create and update meta content with all field required

  - page attachment

    - all page attachments images, videos, files and youtube videos.

## settings

display data dynamically depending on response from server.

push data to the array whenever it arrives

```js
   process(id, key, value) {
      console.log("sdfsdfsdfsdfsdf");
      console.log(id, key, value);
      this.items.push({
        id: id,
        key: key,
        value: value
      });
      console.log(this.items);
    },

```

## users

- users list

check the type of users in the initialization

```js
this.type = this.$route.fullPath.split('/')[2];
```

Monitor the router when it changes between types of users, And send a request to fetch the appropriate data

```js
 $route(to, from) {
      this.reload = false;
      this.type = this.$route.fullPath.split("/")[2];
      console.log("from watcher", this.type);
      this.getUsersList({
        type: this.type === "admins" ? ["superadmin", "admin"] : ["accountant"],
        role: null,
        dir: null,
        search: null,
        order_by: null,
        limit: null,
        page: null
      });
    },
```

- users form
  - used to update or create user depending on the route

replace the role from string to integer when form submited

```js
   getRole() {
      switch (this.gridForm.role) {
        case "superadmin":
          return 1;
        case "admin":
          return 2;
        case "accountant":
          return 7;
      }
    },
```

set user role list as required depending on the type of users created from.

```js
creation(type) {
      console.log(type);
      switch (type) {
        case "admins":
          return (this.roleOptions = [
            { text: "Super Admin", value: 1 },
            { text: "Admin", value: 2 }
          ]);
        case "accountant":
          return (this.roleOptions = [{ text: "Accountant", value: 7 }]);
      }
    }
```

## user

- login

- forgetPassword

- register

- ResetPassword

- profile

  - user information:

    - name

    - date of birth

    - email

    - gender

    - profile-image

format date whenever user change it to become like "yyyy-mm-dd"

```js
this.updateUserProfile({
  first_name: this.form.first_name,
  last_name: this.form.last_name,
  email: this.form.email,
  phone_number: this.form.phone_number,
  _method: 'PUT',
  image: this.file ? this.file[0] : null,
  gender: this.form.gender,
  dob: this.selectedDate ? this.dob.toISOString().split('T')[0] : this.dob,
});
```
