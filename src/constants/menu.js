import { adminRoot } from "./config";
import { UserRole } from "../utils/auth.roles";

const data = [
  {
    id: "piaf",
    icon: "iconsminds-shop",
    label: "menu.piaf",
    to: `${adminRoot}/piaf`,
    subs: [
      {
        icon: "simple-icon-paper-plane",
        label: "menu.start",
        to: `${adminRoot}/piaf/start`
        // roles: [UserRole.Admin, UserRole.Editor],
      }
    ]
  },

  {
    id: "blockCategories",
    icon: "iconsminds-picasa",
    label: "menu.blocks-category",
    to: `${adminRoot}/blockCategories`
  },
  {
    id: "categories",
    icon: "simple-icon-grid",
    label: "menu.categories",
    to: `${adminRoot}/categories`
  },
  {
    id: "auctions",
    icon: "simple-icon-folder",
    label: "menu.auctions",
    to: `${adminRoot}/auctions`
  },
  {
    id: "Pages",
    icon: "iconsminds-digital-drawing",
    label: "menu.pages",
    to: `${adminRoot}/pages`,
    roles: ["superadmin"]
  },
  {
    id: "admins",
    icon: "simple-icon-user",
    label: "menu.admins",
    to: `${adminRoot}/admins`,
    roles: ["superadmin"]
  },
  {
    id: "accountant",
    icon: "simple-icon-people",
    label: "menu.accountant",
    to: `${adminRoot}/accountant`,
    roles: ["superadmin"]
  },
  {
    id: "Settings",
    icon: "simple-icon-settings",
    label: "menu.settings",
    to: `${adminRoot}/settings`,
    roles: ["superadmin"]
  }

  // {
  //   id: "pages",
  //   icon: "iconsminds-digital-drawing",
  //   label: "menu.pages",
  //   to: "/user/login",
  //   subs: [
  //     {
  //       icon: "simple-icon-user-following",
  //       label: "menu.login",
  //       to: "/user/login",
  //       newWindow: true
  //     },
  //     {
  //       icon: "simple-icon-user-follow",
  //       label: "menu.register",
  //       to: "/user/register",
  //       newWindow: true
  //     },
  //     {
  //       icon: "simple-icon-user-unfollow",
  //       label: "menu.forgot-password",
  //       to: "/user/forgot-password",
  //       newWindow: true
  //     },
  //     {
  //       icon: "simple-icon-user-following",
  //       label: "menu.reset-password",
  //       to: "/user/reset-password",
  //       newWindow: true
  //     }
  //   ]
  // },
];
export default data;
