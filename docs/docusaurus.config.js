// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const darkCodeTheme = require("prism-react-renderer/themes/dracula")
const lightCodeTheme = require("prism-react-renderer/themes/github")

const typedocOptions = {
  // TSDoc
  disableSources: true,
  // cleanOutputDir: true,

  excludeExternals: true,
  excludePrivate: true,

  watch: process.env.TYPEDOC_WATCH === "true",

  // Markdown
  hideInPageTOC: true,
  hideBreadcrumbs: true,
  hidePageTitle: true,
}

const packages = ["server", "client", "utils"]

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "@cardsgame",
  tagline: "Documentation",
  url: "https://cardsgame.darekgreenly.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "Zielak",
  projectName: "cardsGame",

  plugins: [
    ...packages.map((package, idx) => {
      /**
       * @type {import('@docusaurus/types/src').PluginConfig}
       */
      const plugin = [
        "docusaurus-plugin-typedoc",
        // Plugin / TypeDoc options
        {
          id: `api-${package}`,
          entryPoints: [`../packages/${package}/src/index.ts`],
          tsconfig: [`../packages/${package}/src/tsconfig.json`],
          out: `api/${package}`,

          sidebar: {
            categoryLabel: package[0].toUpperCase() + package.substring(1),
            position: idx,
            fullNames: true,
          },
          ...typedocOptions,
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
          // {
          //   type: "doc",
          //   docId: "introduction/index",
          //   position: "left",
          //   label: "Guides",
          // },
          // {
          //   type: "doc",
          //   docId: "api/server/",
          //   position: "left",
          //   label: "API",
          // },
          // {
          //   type: "doc",
          //   docId: "api/server",
          //   position: "left",
          //   label: "API",
          // },
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
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Tutorial",
                to: "/introduction",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Discord",
                href: "https://discord.gg/rKATWAKj",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/zielakpl",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/zielak/cardsGame",
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
