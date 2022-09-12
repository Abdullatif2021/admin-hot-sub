import { UserRole } from "../utils/auth.roles";

export const defaultMenuType = "menu-default"; // 'menu-default', 'menu-sub-hidden', 'menu-hidden';
export const adminRoot = "/app";
export const searchPath = `${adminRoot}/#`;
export const buyUrl = "https://1.envato.market/nEyZa";
export const apiUrl = process.env.VUE_APP_API_ROOT;

export const subHiddenBreakpoint = 1440;
export const menuHiddenBreakpoint = 768;

export const defaultLocale = "en";
export const defaultDirection = "ltr"; 
export const localeOptions = [
  { id: "en", name: "English LTR", direction: "ltr" },
  { id: "ar", name: "Arabic", direction: "rtl" }
];

export const currentUser = {
  id: 1,
  title: "Default User",
  img: "/assets/img/profiles/l-7.jpg",
  date: "Last seen today 15:24",
  role: UserRole.superadmin
};

export const isAuthGuardActive = true;
export const themeRadiusStorageKey = "theme_radius";
export const themeSelectedColorStorageKey = "theme_selected_color";
export const defaultColor = "light.blueolympic";
export const colors = [
  "bluenavy",
  "blueyale",
  "blueolympic",
  "greenmoss",
  "greenlime",
  "purplemonster",
  "orangecarrot",
  "redruby",
  "yellowgranola",
  "greysteel"
];
