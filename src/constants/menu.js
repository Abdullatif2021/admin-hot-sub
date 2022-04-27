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
    id: "blocks",
    icon: "iconsminds-picasa",
    label: "menu.blocks",
    to: `${adminRoot}/blocks`
  },
  {
    id: "users",
    icon: "simple-icon-people",
    label: "menu.users",
    to: `${adminRoot}/users`,
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
  // {
  //   id: "single",
  //   icon: "iconsminds-three-arrow-fork",
  //   label: "menu.single",
  //   to: `${adminRoot}/single`
  // }
];
export default data;
