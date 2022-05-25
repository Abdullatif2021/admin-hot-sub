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
    to: `${adminRoot}/blockCategories`,
    roles: ["superadmin"]
  },
  {
    id: "categories",
    icon: "simple-icon-grid",
    label: "menu.categories",
    to: `${adminRoot}/categories`,
    roles: ["superadmin"]
  },
  {
    id: "auctions",
    icon: "simple-icon-folder",
    label: "menu.auctions",
    to: `${adminRoot}/auctions`,
    roles: ["superadmin", "admin", "accountant"]
  },
  {
    id: "Pages",
    icon: "iconsminds-digital-drawing",
    label: "menu.pages",
    to: `${adminRoot}/pages`,
    roles: ["superadmin", "admin", "editor"]
  },
  {
    id: "admins",
    icon: "simple-icon-user",
    label: "menu.admins",
    to: `${adminRoot}/admins`,
    roles: ["superadmin", "admin"]
  },
  {
    id: "accountant",
    icon: "simple-icon-people",
    label: "menu.accountant",
    to: `${adminRoot}/accountant`,
    roles: ["superadmin", "admin"]
  },
  {
    id: "Settings",
    icon: "simple-icon-settings",
    label: "menu.settings",
    to: `${adminRoot}/settings`,
    roles: ["superadmin", "admin"]
  }
];
export default data;
