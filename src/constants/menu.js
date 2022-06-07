import { adminRoot } from "./config";
import { UserRole } from "../utils/auth.roles";

const data = [
  {
    id: "piaf",
    icon: "iconsminds-shop",
    label: "Piaf",
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
    label: "Blocks Category",
    to: `${adminRoot}/blockCategories`,
    roles: ["superadmin"]
  },
  {
    id: "categories",
    icon: "simple-icon-grid",
    label: "Categories",
    to: `${adminRoot}/categories`,
    roles: ["superadmin"]
  },
  {
    id: "auctions",
    icon: "simple-icon-folder",
    label: "Auctions",
    to: `${adminRoot}/auctions`,
    roles: ["superadmin", "admin", "accountant"]
  },
  {
    id: "Pages",
    icon: "iconsminds-digital-drawing",
    label: "Pages",
    to: `${adminRoot}/pages`,
    roles: ["superadmin", "admin", "editor"]
  },
  {
    id: "admins",
    icon: "simple-icon-user",
    label: "Admins",
    to: `${adminRoot}/admins`,
    roles: ["superadmin", "admin"]
  },
  {
    id: "users",
    icon: "simple-icon-people",
    label: "Users",
    to: `${adminRoot}/users`,
    roles: ["superadmin", "admin"]
  },
  {
    id: "accountant",
    icon: "simple-icon-people",
    label: "Accountant",
    to: `${adminRoot}/accountant`,
    roles: ["superadmin", "admin"]
  },
  {
    id: "Settings",
    icon: "simple-icon-settings",
    label: "Settings",
    to: `${adminRoot}/settings`,
    roles: ["superadmin", "admin"]
  }
];
export default data;
