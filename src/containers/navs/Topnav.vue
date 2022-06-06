<template>
  <nav class="navbar fixed-top">
    <div class="d-flex align-items-center navbar-left">
      <a
        href="#"
        class="menu-button d-none d-md-block"
        @click.prevent.stop="
          changeSideMenuStatus({
            step: menuClickCount + 1,
            classNames: menuType,
            selectedMenuHasSubItems
          })
        "
      >
        <menu-icon />
      </a>
      <a
        href="#"
        class="menu-button-mobile d-xs-block d-sm-block d-md-none"
        @click.prevent.stop="changeSideMenuForMobile(menuType)"
      >
        <mobile-menu-icon />
      </a>
      <div
        :class="{ search: true, 'mobile-view': isMobileSearch }"
        ref="searchContainer"
        @mouseenter="isSearchOver = true"
        @mouseleave="isSearchOver = false"
      >
        <b-input
          :placeholder="$t('menu.search')"
          @keypress.native.enter="search"
          v-model="searchKeyword"
        />
        <span class="search-icon" @click="searchClick">
          <i class="simple-icon-magnifier"></i>
        </span>
      </div>
      <div class="d-inline-block">
        <b-dropdown
          id="langddm"
          class="ml-2"
          variant="light"
          size="sm"
          toggle-class="language-button"
        >
          <template slot="button-content">
            <span class="name">{{ $i18n.locale.toUpperCase() }}</span>
          </template>
          <b-dropdown-item
            v-for="(l, index) in localeOptions"
            :key="index"
            v-b-modal.modalbasic
            @click="changeLocale(l.id, l.direction)"
            >{{ l.name }}</b-dropdown-item
          >
        </b-dropdown>
      </div>
    </div>
    <router-link class="navbar-logo" :to="adminRoot">
      <span class="logo d-none d-xs-block"></span>
      <span class="logo-mobile d-block d-xs-none"></span>
    </router-link>

    <div class="navbar-right">
      <div class="d-none d-md-inline-block align-middle mr-3">
        <switches
          id="tool-mode-switch"
          v-model="isDarkActive"
          theme="custom"
          class="vue-switcher-small"
          color="primary"
        />
        <b-tooltip
          target="tool-mode-switch"
          placement="left"
          title="Dark Mode"
        ></b-tooltip>
      </div>
      <div class="header-icons d-inline-block align-middle">
        <div class="position-relative d-none d-sm-inline-block">
          <b-dropdown
            variant="empty"
            size="sm"
            right
            toggle-class="header-icon"
            menu-class="position-absolute mt-3 iconMenuDropdown"
            no-caret
          >
            <template slot="button-content">
              <i class="simple-icon-grid" />
            </template>
            <div>
              <router-link to="#" class="icon-menu-item">
                <i class="iconsminds-shop-4 d-block" />
                {{ $t("menu.dashboards") }}
              </router-link>
              <router-link to="#" class="icon-menu-item">
                <i class="iconsminds-pantone d-block" />
                {{ $t("menu.ui") }}
              </router-link>
              <router-link to="#" class="icon-menu-item">
                <i class="iconsminds-bar-chart-4 d-block" />
                {{ $t("menu.charts") }}
              </router-link>
              <router-link to="#" class="icon-menu-item">
                <i class="iconsminds-speach-bubble d-block" />
                {{ $t("menu.chat") }}
              </router-link>
              <router-link to="#" class="icon-menu-item">
                <i class="iconsminds-formula d-block" />
                {{ $t("menu.survey") }}
              </router-link>
              <router-link to="#" class="icon-menu-item">
                <i class="iconsminds-check d-block" />
                {{ $t("menu.todo") }}
              </router-link>
            </div>
          </b-dropdown>
        </div>

        <div class="position-relative d-inline-block">
          <b-dropdown
            variant="empty"
            size="sm"
            right
            toggle-class="header-icon notificationButton"
            menu-class="position-absolute mt-3 notificationDropdown"
            no-caret
          >
            <template slot="button-content">
              <i class="simple-icon-bell" />
              <span class="count">3</span>
            </template>
            <vue-perfect-scrollbar
              :settings="{ suppressScrollX: true, wheelPropagation: false }"
            >
              <div
                class="d-flex flex-row mb-3 pb-3 border-bottom"
                v-for="(n, index) in notifications"
                :key="index"
              >
                <router-link to="#">
                  <img
                    :src="n.img"
                    :alt="n.title"
                    class="img-thumbnail list-thumbnail xsmall border-0 rounded-circle"
                  />
                </router-link>
                <div class="pl-3 pr-2">
                  <router-link to="#">
                    <p class="font-weight-medium mb-1">{{ n.title }}</p>
                    <p class="text-muted mb-0 text-small">{{ n.date }}</p>
                  </router-link>
                </div>
              </div>
            </vue-perfect-scrollbar>
          </b-dropdown>
        </div>
        <div class="position-relative d-none d-sm-inline-block">
          <div class="btn-group">
            <b-button
              variant="empty"
              class="header-icon btn-sm"
              @click="toggleFullScreen"
            >
              <i
                :class="{
                  'd-inline-block': true,
                  'simple-icon-size-actual': fullScreen,
                  'simple-icon-size-fullscreen': !fullScreen
                }"
              />
            </b-button>
          </div>
        </div>
      </div>
      <div class="user d-inline-block">
        <b-dropdown
          class="dropdown-menu-right"
          right
          variant="empty"
          toggle-class="p-0"
          menu-class="mt-3"
          no-caret
        >
          <template slot="button-content">
            <span class="name mr-1"
              >{{ currentUser.first_name }} {{ currentUser.last_name }}</span
            >
            <span>
              <img
                class="user_img"
                :alt="currentUser.first_name"
                :src="
                  currentUser.image
                    ? currentUser.image
                    : '/assets/img/profiles/user.png'
                "
              />
            </span>
          </template>
          <b-dropdown-item @click="profile">{{
            $t("forms.account")
          }}</b-dropdown-item>
          <b-dropdown-divider />
          <b-dropdown-item @click="logout">{{
            $t("forms.sign_out")
          }}</b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
    <b-modal
      id="modalbasic"
      ref="modalbasic"
      :title="$t('modal.modal-lang-title')"
    >
      {{ $t("forms.languageQuestion") }}
      <template slot="modal-footer">
        <b-button
          variant="primary"
          @click="change_Locale('modalbasic')"
          class="mr-1"
        >
          {{ $t("button.change") }}</b-button
        >
        <b-button variant="secondary" @click="hideModal('modalbasic')">{{
          $t("button.no")
        }}</b-button>
      </template>
    </b-modal>
  </nav>
</template>

<script>
import Switches from "vue-switches";
import notifications from "../../data/notifications";
import router from "../../router";
import { mapGetters, mapMutations, mapActions } from "vuex";
import { MenuIcon, MobileMenuIcon } from "../../components/Svg";
import {
  searchPath,
  menuHiddenBreakpoint,
  localeOptions,
  buyUrl,
  adminRoot
} from "../../constants/config";
import {
  getDirection,
  setDirection,
  getThemeColor,
  setThemeColor
} from "../../utils";
export default {
  components: {
    "menu-icon": MenuIcon,
    "mobile-menu-icon": MobileMenuIcon,
    switches: Switches
  },
  data() {
    return {
      searchKeyword: "",
      isMobileSearch: false,
      isSearchOver: false,
      fullScreen: false,
      menuHiddenBreakpoint,
      searchPath,
      localeOptions,
      buyUrl,
      notifications,
      isDarkActive: false,
      adminRoot,
      _direction: null,
      _locale: null
    };
  },
  methods: {
    ...mapMutations(["changeSideMenuStatus", "changeSideMenuForMobile"]),
    ...mapActions(["setLang", "signOut", "changePreferLocale"]),
    search() {
      this.$router.push(`${this.searchPath}?search=${this.searchKeyword}`);
      this.searchKeyword = "";
    },
    searchClick() {
      if (window.innerWidth < this.menuHiddenBreakpoint) {
        if (!this.isMobileSearch) {
          this.isMobileSearch = true;
        } else {
          this.search();
          this.isMobileSearch = false;
        }
      } else {
        this.search();
      }
    },
    handleDocumentforMobileSearch() {
      if (!this.isSearchOver) {
        this.isMobileSearch = false;
        this.searchKeyword = "";
      }
    },
    change_Locale() {
      this.changePreferLocale({ locale: this._locale });
    },

    changeLocale(locale, direction) {
      this._locale = locale;
      this._direction = direction;
      console.log(locale, direction);
    },
    profile() {
      router.push("/user/profile");
    },
    hideModal(refname) {
      const currentDirection = getDirection().direction;
      if (this._direction !== currentDirection) {
        setDirection(this._direction);
      }
      this.setLang({ locale: this._locale });
      this.$refs[refname].hide();
      // router.push("/");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
      // setTimeout(() => {
      //   router.push("/user/login");
      // }, 5000);
    },
    logout() {
      this.signOut();
    },

    toggleFullScreen() {
      const isInFullScreen = this.isInFullScreen();

      var docElm = document.documentElement;
      if (!isInFullScreen) {
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
          docElm.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
      this.fullScreen = !isInFullScreen;
    },
    isInFullScreen() {
      return (
        (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement &&
          document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement &&
          document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null)
      );
    }
  },
  computed: {
    ...mapGetters({
      currentUser: "currentUser",
      menuType: "getMenuType",
      menuClickCount: "getMenuClickCount",
      selectedMenuHasSubItems: "getSelectedMenuHasSubItems",
      _preferLocale: "_preferLocale"
    })
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleDocumentforMobileSearch);
  },
  created() {
    const color = getThemeColor();
    this.isDarkActive = color.indexOf("dark") > -1;
  },
  watch: {
    "$i18n.locale"(to, from) {
      if (from !== to) {
        this.$router.go(this.$route.path);
      }
    },
    currentUser(val) {
      console.log("hi from watcher", val);
    },
    _preferLocale(val) {
      this.$refs["modalbasic"].hide();

      const currentDirection = getDirection().direction;
      if (this._direction !== currentDirection) {
        setDirection(this._direction);
      }
      this.setLang({ locale: this._locale });
      router.push("/user/login");

      setTimeout(() => {
        window.location.reload();
      }, 500);
      // setTimeout(() => {
      //   router.push("/user/login");
      // }, 5000);
    },
    isDarkActive(val) {
      let color = getThemeColor();
      let isChange = false;
      if (val && color.indexOf("light") > -1) {
        isChange = true;
        color = color.replace("light", "dark");
      } else if (!val && color.indexOf("dark") > -1) {
        isChange = true;
        color = color.replace("dark", "light");
      }
      if (isChange) {
        setThemeColor(color);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    },
    isMobileSearch(val) {
      if (val) {
        document.addEventListener("click", this.handleDocumentforMobileSearch);
      } else {
        document.removeEventListener(
          "click",
          this.handleDocumentforMobileSearch
        );
      }
    }
  }
};
</script>
