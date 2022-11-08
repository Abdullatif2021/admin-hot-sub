import Vue from "vue";
import VueRouter from "vue-router";
import AuthGuard from "./utils/auth.guard";
import { adminRoot } from "./constants/config";
import { UserRole } from "./utils/auth.roles";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    // component: () => import(/* webpackChunkName: "home" */ "./views/home"),
    redirect: `/user/login`
  },
  {
    path: adminRoot,
    component: () => import(/* webpackChunkName: "app" */ "./views/app"),
    redirect: `${adminRoot}/static`,
    meta: { loginRequired: true },

    children: [
      {
        path: "static",
        component: () =>
          import(/* webpackChunkName: "piaf" */ "./views/app/piaf"),
        redirect: `${adminRoot}/static/start`,
        // beforeEnter: (to, from) => {
        //   console.log(to, from);
        //   return true
        // },
        children: [
          {
            path: "owner",
            component: () =>
              import(/* webpackChunkName: "piaf" */ "./views/app/piaf/owner_dashboard")
            // meta: { roles: [UserRole.Admin, UserRole.Editor] },
          },
          {
            path: "start",
            component: () =>
              import(/* webpackChunkName: "piaf" */ "./views/app/piaf/Start")
            // meta: { roles: [UserRole.Admin, UserRole.Editor] },
          }
        ]
      },
      {
        path: "blockCategories",
        component: () =>
          import(
            /* webpackChunkName: "second-menu" */ "./views/app/block_categories"
          ),
        redirect: `${adminRoot}/blockCategories/categories_List`,
        meta: { loginRequired: true, roles: ["superadmin"] },

        children: [
          {
            path: "categories_List",
            component: () =>
              import(
                /* webpackChunkName: "piaf" */ "./views/app/block_categories/categories_List"
              )
          },
          {
            path: "category",
            component: () =>
              import(
                /* webpackChunkName: "blog" */ "./views/app/block_categories/block_category"
              )
          }
        ]
      },
      {
        path: "blocks",
        component: () =>
          import(/* webpackChunkName: "second-menu" */ "./views/app/block"),
        redirect: `${adminRoot}/blocks/blockList`,
        meta: { loginRequired: true, roles: ["superadmin", "editor", "admin"] },

        children: [
          {
            path: "blockList/:id",
            component: () =>
              import(
                /* webpackChunkName: "piaf" */ "./views/app/block/blockList"
              )
          },
          {
            path: "block",
            component: () =>
              import(/* webpackChunkName: "blog" */ "./views/app/block/block")
          },
          {
            path: "add-block",
            component: () =>
              import(
                /* webpackChunkName: "blog" */ "./views/app/block/add_block"
              )
          },
          {
            path: "category",
            component: () =>
              import(
                /* webpackChunkName: "blog" */ "./views/app/block_categories/block_category"
              )
          }
        ]
      },
      {
        path: "categories",
        component: () =>
          import(
            /* webpackChunkName: "second-menu" */ "./views/app/categories"
          ),
        redirect: `${adminRoot}/categories/categoriesList`,
        meta: { loginRequired: true, roles: ["superadmin"] },

        children: [
          {
            path: "categoriesList",
            component: () =>
              import(
                /* webpackChunkName: "piaf" */ "./views/app/categories/categories_list"
              )
          },
          {
            path: "category",
            component: () =>
              import(
                /* webpackChunkName: "blog" */ "./views/app/categories/category"
              )
          },
          {
            path: "add-category",
            component: () =>
              import(
                /* webpackChunkName: "blog" */ "./components/shared/add_category"
              )
          }
        ]
      },
      {
        path: "faq",
        component: () =>
          import(/* webpackChunkName: "second-menu" */ "./views/app/faq"),
        redirect: `${adminRoot}/faq/faq_list`,
        meta: { loginRequired: true, roles: ["superadmin", "admin"] },

        children: [
          {
            path: "faq_list",
            component: () =>
              import(/* webpackChunkName: "piaf" */ "./views/app/faq/faq_list")
          },
          {
            path: "faq",
            component: () =>
              import(/* webpackChunkName: "blog" */ "./views/app/faq/faq")
          },

          {
            path: "categories",
            component: () =>
              import(
                /* webpackChunkName: "blog" */ "./views/app/faq/categories_list"
              )
          }
        ]
      },
      {
        path: "auctions",
        component: () =>
          import(/* webpackChunkName: "second-menu" */ "./views/app/auctions"),
        redirect: `${adminRoot}/auctions/auction_list`,
        meta: {
          loginRequired: true,
          roles: ["superadmin", "admin", "accountant"]
        },

        children: [
          {
            path: "auction_list",
            component: () =>
              import(
                /* webpackChunkName: "piaf" */ "./views/app/auctions/auction_list"
              )
          },
          {
            path: "auction",
            component: () =>
              import(
                /* webpackChunkName: "blog" */ "./views/app/auctions/auction"
              ) 
          },

          {
            path: "auction-review",
            component: () =>
            import ( /* webpackChunkName: "blog" */ "./views/app/auctions/auction_review")  
          },
          {
            path: "auction-product",
            component: () =>
            import( 
              /* webpackChunkName: "blog" */ "./views/app/auctions/auction_product"
              )  
          }
        ]
      },
      {
        path: "pages",
        component: () =>
          import(
            /* webpackChunkName: "second-menu" */ "./views/app/pages_managment"
          ),
        redirect: `${adminRoot}/pages/pageList`,
        meta: { loginRequired: true, roles: ["superadmin", "editor", "admin"] },
        children: [
          {
            path: "pageList",
            component: () =>
              import(
                /* webpackChunkName: "piaf" */ "./views/app/pages_managment/pages_list"
              )
          },
          {
            path: "page",
            component: () =>
              import(
                /* webpackChunkName: "piaf" */ "./views/app/pages_managment/page"
              )
          }
        ]
      },
      {
        path: "admins",
        component: () =>
          import(/* webpackChunkName: "second-menu" */ "./views/app/users"),
        redirect: `${adminRoot}/admins/usersList`,
        meta: { loginRequired: true, roles: ["superadmin", "admin"] },

        children: [
          {
            path: "usersList",
            component: () =>
              import(
                /* webpackChunkName: "piaf" */ "./views/app/users/usersList"
              )
          },
          {
            path: "user",
            component: () =>
              import(
                /* webpackChunkName: "piaf" */ "./views/app/users/userForm"
              )
          }
        ]
      },
      {
        path: "users",
        component: () =>
          import(/* webpackChunkName: "second-menu" */ "./views/app/users"),
        redirect: `${adminRoot}/users/usersList`,
        meta: { loginRequired: true, roles: ["superadmin", "admin"] },

        children: [
          {
            path: "usersList",
            component: () =>
              import(
                /* webpackChunkName: "piaf" */ "./views/app/users/usersList"
              )
          },
          {
            path: "user",
            component: () =>
              import(
                /* webpackChunkName: "piaf" */ "./views/app/users/userForm"
              )
          }
        ]
      },
      {
        path: "accountant",
        component: () =>
          import(/* webpackChunkName: "second-menu" */ "./views/app/users"),
        redirect: `${adminRoot}/accountant/usersList`,
        meta: { loginRequired: true, roles: ["superadmin", "admin"] },

        children: [
          {
            path: "usersList",
            component: () =>
              import(
                /* webpackChunkName: "piaf" */ "./views/app/users/usersList"
              )
          },
          {
            path: "user",
            component: () =>
              import(
                /* webpackChunkName: "piaf" */ "./views/app/users/userForm"
              )
          }
        ]
      },
      {
        path: "owners",
        component: () =>
          import(/* webpackChunkName: "second-menu" */ "./views/app/users/owners"),
        redirect: `${adminRoot}/owners/ownersList`,
        meta: { loginRequired: true, roles: ["superadmin"] },
        children: [
          {
            path: "ownersList",
            component: () =>
              import(
                /* webpackChunkName: "piaf" */ "./views/app/users/owners/ownersList"
              )
          },
          {
            path: "owner",
            component: () =>
              import(
                /* webpackChunkName: "piaf" */ "./views/app/users/owners/owner"
              )
          }
        ]
      },
      {
        path: "settings",
        component: () =>
          import(/* webpackChunkName: "single" */ "./views/app/settings"),
        meta: { loginRequired: true, roles: ["superadmin"] }
      },
      {
        path: "profile",
        component: () =>
          import(/* webpackChunkName: "single" */ "./views/app/single")
      }
    ]
  },
  {
    path: "/error",
    component: () => import(/* webpackChunkName: "error" */ "./views/Error")
  },
  {
    path: "/user",
    component: () => import(/* webpackChunkName: "user" */ "./views/user"),
    redirect: "/user/login",
    children: [
      {
        path: "login",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/Login")
      },
      {
        path: "register",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/Register")
      },
      {
        path: "forgot-password",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/ForgotPassword")
      },
      {
        path: "reset-password",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/ResetPassword")
      },
      {
        path: "profile",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/profile")
      }
    ]
  },
  {
    path: "*",
    component: () => import(/* webpackChunkName: "error" */ "./views/Error")
  }
];

const router = new VueRouter({
  linkActiveClass: "active",
  routes,
  mode: "history"
});
router.beforeEach(AuthGuard);
export default router;
