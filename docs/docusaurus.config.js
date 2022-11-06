// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const darkCodeTheme = require("prism-react-renderer/themes/dracula")
const lightCodeTheme = require("prism-react-renderer/themes/github")

const { typedocOptions, packagesToDocs } = require("./typedoc/base.typedoc")

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "@cardsgame",
  tagline: "Create your own multiplayer cards game(s)",
  url: "https://cardsgame.darekgreenly.com",
  baseUrl: "/",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "Zielak",
  projectName: "cardsGame",

  plugins: [
    ...packagesToDocs.map((package, idx) => {
      /**
       * @type {import('@docusaurus/types/src').PluginConfig}
       */
      const plugin = [
        "docusaurus-plugin-typedoc",
        // Plugin / TypeDoc options
        {
          ...typedocOptions,
          id: `api-${package}`,
          entryPoints: [`../packages/${package}/src/index.ts`],
          tsconfig: [`../packages/${package}/tsconfig.build.json`],
          out: `api/${package}`,

          sidebar: {
            categoryLabel: package[0].toUpperCase() + package.substring(1),
            position: idx,
            fullNames: true,
          },
        },
      ]
      return plugin
    }),
  ],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          routeBasePath: "/",
          editUrl: "https://github.com/greenlyGames/cardsGame-docs/tree/main/",
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Cards Game",
        logo: {
          alt: "Cards Game",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "doc",
            docId: "getting-started/index",
            position: "left",
            label: "Getting started",
          },
          {
            type: "docSidebar",
            position: "left",
            sidebarId: "api",
            label: "API",
          },
          // Versioning dropdown box
          // {
          //   type: "docsVersionDropdown",
          // },
          // { to: "/blog", label: "Blog", position: "left" },
          {
            href: "https://github.com/zielak/cardsGame",
            label: "GitHub",
            position: "right",
          },
          {
            href: "https://discord.gg/ReX3BZe9WW",
            label: "Discord",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Community",
            items: [
              {
                label: "Discord",
                href: "https://discord.gg/ReX3BZe9WW",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/zielakpl",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Cards Game, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
}

module.exports = config
