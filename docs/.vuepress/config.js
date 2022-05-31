module.exports = {
  plugins: ["@vuepress/back-to-top", "@vuepress/medium-zoom"],
  title: "Hello VuePress",
  description: "Just playing around",
  themeConfig: {
    lastUpdated: "Last Updated",
    nav: [],
    sidebar: [
      {
        title: "Group 1", // required
        path: "/guide/", // optional, which should be a absolute path.
        collapsable: false, // optional, defaults to true
        sidebarDepth: 1, // optional, defaults to 1
        children: [
          "/guide/",
          "/installation/",
          "/advanced/",
          "/installation/",
          "/views/",
          "/components/",
          "/containers/",
          "/constants/",
          "/plugins/"
        ]
      },
      {
        title: "Group 2",
        children: ["/installation/", "/advanced/", "/guide/"]
      }
    ]
  }
};
