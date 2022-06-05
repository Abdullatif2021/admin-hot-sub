module.exports = {
  plugins: ["@vuepress/back-to-top", "@vuepress/medium-zoom"],
  title: "Dashboard",
  description: "dashboard Description",
  themeConfig: {
    lastUpdated: "Last Updated",
    // nav: [
    //   { text: "Home", link: "/" },
    //   { text: "Guide", link: "/guide/" },
    //   {
    //     text: "Languages",
    //     items: [
    //       { text: "Chinese", link: "/language/chinese/" },
    //       { text: "Japanese", link: "/language/japanese/" }
    //     ]
    //   },
    //   { text: "External", link: "https://google.com" }
    // ],
    sidebar: [
      {
        title: "Guide", // required
        path: "/foo/", // optional, which should be a absolute path.
        collapsable: false, // optional, defaults to true
        sidebarDepth: 1, // optional, defaults to 1
        children: [
          "/installation/",
          "/components/",
          "/plugins/",
          "/constants/",
          "/containers/",
          "/locales/",
          "/store/",
          "/utils/",
          "/views/"
        ]
      }
    ]
  }
};
