import Vue from "vue";
import VueRouter from "vue-router";
import AuthGuard from "./utils/auth.guard";
import { adminRoot } from "./constants/config";
import { UserRole } from "./utils/auth.roles";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import(/* webpackChunkName: "home" */ "./views/home"),
    redirect: `/user/login`
  },
  {
    path: adminRoot,
    component: () => import(/* webpackChunkName: "app" */ "./views/app"),
    redirect: `${adminRoot}/piaf`,
    meta: { loginRequired: true },

    children: [
      {
        path: "piaf",
        component: () =>
          import(/* webpackChunkName: "piaf" */ "./views/app/piaf"),
        redirect: `${adminRoot}/piaf/start`,
        children: [
          {
            path: "start",
            component: () =>
              import(/* webpackChunkName: "piaf" */ "./views/app/piaf/Start")
            // meta: { roles: [UserRole.Admin, UserRole.Editor] },
          }
        ]
      },
      {
        path: "second-menu",
        component: () =>
          import(
            /* webpackChunkName: "second-menu" */ "./views/app/second-menu"
          ),
        redirect: `${adminRoot}/second-menu/second`,
        children: [
          {
            path: "second",
            component: () =>
              import(
                /* webpackChunkName: "piaf" */ "./views/app/second-menu/Second"
              )
          }
        ]
      },
      {
        path: "blocks",
        component: () =>
          import(/* webpackChunkName: "second-menu" */ "./views/app/block"),
        redirect: `${adminRoot}/blocks/blockList`,

        children: [
          {
            path: "blockList",
            component: () =>
              import(
                /* webpackChunkName: "piaf" */ "./views/app/block/blockList"
              )
          },
          {
            path: "block/:id",
            component: () =>
              import(/* webpackChunkName: "blog" */ "./views/app/block/block")
          }
        ]
      },
      {
        path: "users",
        component: () =>
          import(/* webpackChunkName: "second-menu" */ "./views/app/users"),
        redirect: `${adminRoot}/users/usersList`,
        meta: { loginRequired: true, roles: ["superadmin"] },

        children: [
          {
            path: "usersList",
            component: () =>
              import(
                /* webpackChunkName: "piaf" */ "./views/app/users/usersList"
              )
          }
        ]
      },

      {
        path: "single",
        component: () =>
          import(/* webpackChunkName: "single" */ "./views/app/single")
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
