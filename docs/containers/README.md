# containers

A group of components that help the application "Helpers"

Itemized lists look like:

- AddNewImageModel

  shared component used to create a new image for pages and blocks

* AddNewVideoModel

  shared component used to create a new video for pages and blocks

* DatatableHeading

  the main header of the app contains the breadcrumb, filters, paginator

* sidebar

  the main header of the app contains the breadcrumb, filters, paginator


    get block category list and push it to the menu items to display it dynamically.

```js
setMenuItems(val) {
val.forEach(item => {
menuItems.push({
id: item.id,
icon: "iconsminds-blogger",
label: item.slug,
roles: ["superadmin", "admin", "editor"],

          to: `${adminRoot}/blocks/blockList/${item.id}`
        });
      });
      this._blockCategories = null;
    },
```

get block category list by the getter '\_Block_Categories'

```js
   _Block_Categories(newVal, old) {
      this.setMenuItems(newVal);
    }
```
