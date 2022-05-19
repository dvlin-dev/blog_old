// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'bowlingQ',
  tagline: '行大于言',
  url: 'https://www.zhangbaolin.top',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo.jpg',
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'bowlingq', // Usually your GitHub org/user name.
  projectName: 'til', // Usually your repo name.
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          
          editUrl: ({ docPath }) => {
            return `https://github.com/bowlingq/blog/tree/master/docs/${docPath}`;
          },
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'bowlingQ',
        items: [{
            type: 'search',
            position: 'right',
          },
          {
            label: "博客",
            position: "right",
            items: [{
                type: "doc",
                label: "JavaScript",
                docId: "JavaScript/index",
              },
              {
                type: "doc",
                label: "Css",
                docId: "css/index",
              },
              {
                type: "doc",
                label: "Browser",
                docId: "browser/index",
              },
              {
                type: "doc",
                label: "Network",
                docId: "network/index",
              },
               {
                type: "doc",
                label: "Engineering",
                docId: "engineering/index",
              },
              {
                type: "doc",
                label: "Git",
                docId: "git/index",
              },
              {
                type: "doc",
                label: "TS",
                docId: "ts/index",
              },
              {
                type: "doc",
                label: "NodeJs",
                docId: "nodejs/index",
              },
              {
                type: "doc",
                label: "React",
                docId: "react/index",
              },
              {
                type: "doc",
                label: "Vue",
                docId: "vue/index",
              },
            ],
          },
          {
            type: 'doc',
            position: 'right',
            label: '日记',
            docId: 'diary/index',
          },
          {
            href: "https://github.com/bowlingq",
            position: "right",
            // custom logo in custom.css
            className: "header-github-link",
            "aria-label": "GitHub repository",
          },
        ],
      },
      // footer: {
      //   style: 'dark',
      //   copyright: `nice to meet you`,
      // },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;