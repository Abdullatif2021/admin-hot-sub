import { adminRoot } from "./config";
import { UserRole } from "../utils/auth.roles";

const data = [
  {
    id: "static",
    icon: "iconsminds-shop",
    label: "Dashboard",
    to: `${adminRoot}/static`
  },

  {
    id: "offers",
    label: "Offers",
    icon: "iconsminds-coins-2",
    roles: ["superadmin"],
    to: `${adminRoot}/offers`
  },
  {
    id: "categories",
    label: "Categories",
    icon: "simple-icon-list",
    roles: ["superadmin"],
    to: `${adminRoot}/categories`
  },
  {
    id: "items",
    label: "Items",
    icon: "simple-icon-pie-chart",
    roles: ["superadmin"],
    to: `${adminRoot}/items/items_list`
  },

  {
    id: "Settings",
    icon: "simple-icon-settings",
    label: "Settings",
    to: `${adminRoot}/settings`,
    roles: ["superadmin"]
  }
];
export default data;
