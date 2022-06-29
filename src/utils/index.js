import axios from "axios";
import {
  defaultDirection,
  defaultColor,
  themeSelectedColorStorageKey,
  themeRadiusStorageKey,
  localeOptions,
  defaultLocale
} from "../constants/config";
import router from "../router";
import { apiUrl } from "../constants/config";
export const loaclee = "";

export const mapOrder = (array, order, key) => {
  array.sort(function(a, b) {
    var A = a[key];
    var B = b[key];
    if (order.indexOf(A + "") > order.indexOf(B + "")) {
      return 1;
    } else {
      return -1;
    }
  });
  return array;
};

export const getCurrentTime = () => {
  const now = new Date();
  return now.getHours() + ":" + now.getMinutes();
};

export const ThemeColors = () => {
  let rootStyle = getComputedStyle(document.body);
  return {
    themeColor1: rootStyle.getPropertyValue("--theme-color-1").trim(),
    themeColor2: rootStyle.getPropertyValue("--theme-color-2").trim(),
    themeColor3: rootStyle.getPropertyValue("--theme-color-3").trim(),
    themeColor4: rootStyle.getPropertyValue("--theme-color-4").trim(),
    themeColor5: rootStyle.getPropertyValue("--theme-color-5").trim(),
    themeColor6: rootStyle.getPropertyValue("--theme-color-6").trim(),
    themeColor1_10: rootStyle.getPropertyValue("--theme-color-1-10").trim(),
    themeColor2_10: rootStyle.getPropertyValue("--theme-color-2-10").trim(),
    themeColor3_10: rootStyle.getPropertyValue("--theme-color-3-10").trim(),
    themeColor4_10: rootStyle.getPropertyValue("--theme-color-3-10").trim(),
    themeColor5_10: rootStyle.getPropertyValue("--theme-color-3-10").trim(),
    themeColor6_10: rootStyle.getPropertyValue("--theme-color-3-10").trim(),
    primaryColor: rootStyle.getPropertyValue("--primary-color").trim(),
    foregroundColor: rootStyle.getPropertyValue("--foreground-color").trim(),
    separatorColor: rootStyle.getPropertyValue("--separator-color").trim()
  };
};

export const getDirection = () => {
  let direction = defaultDirection;
  if (localStorage.getItem("direction")) {
    const localValue = localStorage.getItem("direction");
    if (localValue === "rtl" || localValue === "ltr") {
      direction = localValue;
    }
  }
  return {
    direction,
    isRtl: direction === "rtl"
  };
};

export const setDirection = localValue => {
  let direction = "ltr";
  if (localValue === "rtl" || localValue === "ltr") {
    direction = localValue;
  }
  localStorage.setItem("direction", direction);
};

export const getThemeColor = () => {
  let color = defaultColor;
  try {
    if (localStorage.getItem(themeSelectedColorStorageKey)) {
      color =
        localStorage.getItem(themeSelectedColorStorageKey) || defaultColor;
    }
  } catch (error) {
    color = defaultColor;
  }
  return color;
};

export const setThemeColor = color => {
  try {
    localStorage.setItem(themeSelectedColorStorageKey, color);
  } catch (error) {}
};

export const getThemeRadius = () => {
  let radius = "rounded";
  try {
    if (localStorage.getItem(themeRadiusStorageKey)) {
      radius = localStorage.getItem(themeRadiusStorageKey) || "rounded";
    }
  } catch (error) {
    radius = "rounded";
  }
  return radius;
};

export const setThemeRadius = radius => {
  try {
    localStorage.setItem(themeRadiusStorageKey, radius);
  } catch (error) {}
};

export const getCurrentLanguage = () => {
  let locale = defaultLocale;
  try {
    if (
      localStorage.getItem("currentLanguage") &&
      localeOptions.filter(
        x => x.id === localStorage.getItem("currentLanguage")
      ).length > 0
    ) {
      locale = localStorage.getItem("currentLanguage");
    }
  } catch (error) {
    locale = defaultLocale;
  }
  return locale;
};
export const getAccessToken = () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    return accessToken;
  } catch (error) {
    return error;
  }
};
export const getLanguages = () => {
  try {
    axios.get(`${apiUrl}/languages`).then(res => {
      localStorage.setItem("Languages", JSON.stringify(res.data.data));
    });
  } catch (error) {
    return error;
  }
};

export const setCurrentLanguage = lang => {
  try {
    localStorage.setItem("currentLanguage", lang);
  } catch (error) {}
};

export const getCurrentUser = () => {
  let currentUser = null;
  try {
    currentUser =
      localStorage.getItem("currentUser") != null
        ? JSON.parse(localStorage.getItem("currentUser"))
        : null;
  } catch (error) {
    currentUser = null;
  }
  return currentUser;
};

export const setCurrentUser = user => {
  try {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("currentUser");
    }
  } catch (error) {}
};
export const setTokens = (accessToken, refreshToken) => {
  try {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  } catch (error) {}
};
