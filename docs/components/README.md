# components

A set of components ready to use

# Shared

> add_category  
> attachment
> basic_details  
> category_details  
> meta_data

# add_category

shared component between block category and auction category managment helps to add new category for both of them.

check the type of category is to send request according to it.

```js
if (this._type == "block")
```

# attachment

responsible for all attachment of the pages and blocks lists

# basic_details

responsible for main details of the page and block

# category_details

shared component between block category and auction category managment helps to manage category details for both of them.
get props for perent and send it to meta_data

```js
props: ['_id', '_type'];
```

check the type of category to get the corresponding data

```js
    created() {
    this._type == "block"
      ? ((this.is_block_category = true),
        this.getBlockCategory({ id: this._id }),
        this.getBlockCategoryTypes())
      : this.getCategory({ id: this._id }),
      (this.gridForm.select = "just for form submit");
  },
```

# meta_data

responsible for meta data of auctions category and block category

check the type of category and the id to update or create the correct meta data

```js
  onValitadeFormSubmit() {
     this.$v.$touch();
     this.$v.gridForm.$touch();
     if (!this.$v.gridForm.$invalid) {
       this.enable = true;
       console.log(this.gridForm.id);
       if (this.gridForm.id) {
         if (this.type === "block") {
           this.updateBlockCategoryMeta({
             meta_type_id: this.gridForm.select,
             id: this.id,
             metadata_id: this.gridForm.id,
             ar_content: this.gridForm.ar_detail,
             en_content: this.gridForm.en_detail
           });
         } else {
           this.updateCategoryMetadata({
             meta_type_id: this.gridForm.select,
             id: this.id,
             metadata_id: this.gridForm.id,
             ar_content: this.gridForm.ar_detail,
             en_content: this.gridForm.en_detail
           });
         }
       } else {
         if (this.type === "block") {
           this.createBlockCategoryMetadata({
             meta_type_id: this.gridForm.select,
             id: this.id,
             metadata_id: this.gridForm.id,
             ar_content: this.gridForm.ar_detail,
             en_content: this.gridForm.en_detail
           });
         } else {
           this.createCategoryMetadata({
             meta_type_id: this.gridForm.select,
             id: this.id,
             ar_content: this.gridForm.ar_detail,
             en_content: this.gridForm.en_detail
           });
         }
       }
     }
   },
```
