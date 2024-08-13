import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  outDir: 'www.buerblog.cn',
  srcDir: 'src',
  lang: 'zh-CN',
  title: '不二博客',
  description: '记录学习、生活、书单',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    [
      'meta',
      { name: 'google-site-verification', content: 'H9EAJ4-2OSGTFlSc_rF8Ht16HFos4Ulgjj1HQFCydRU' },
    ],
    ['meta', { name: 'baidu-site-verification', content: 'codeva-753431egST' }],
    [
      'script',
      {},
      `var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?efb11fac579bb27bb90fed0959ccf9c1";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();`,
    ],
  ],

  cleanUrls: true,

  themeConfig: {
    logo: '/logo.jpg',

    nav: [
      { text: '主页', link: '/' },
      { text: '学习', link: '/docs/study/index.html', activeMatch: '/docs/study' },
      { text: '生活', link: '/docs/life/index.html', activeMatch: '/docs/life' },
      { text: '书单', link: '/docs/book/index.html', activeMatch: '/docs/book' },
    ],

    sidebar: {
      '/docs/study': [
        {
          text: '前端',
          collapsed: false,
          items: [
            {
              text: '如何发布 NPM 包',
              link: '/docs/study/web/npm-publish',
            },
            {
              text: '了解 Vite 插件',
              link: '/docs/study/web/vite-plugin',
            },
            {
              text: '表格封装之 useForm 封装',
              link: '/docs/study/web/use-form',
            },
            {
              text: '表格封装之 useTable 封装',
              link: '/docs/study/web/use-table',
            },
            {
              text: '通过 nvm 管理 Node 版本',
              link: '/docs/study/web/nvm',
            },
            {
              text: 'Git Flow 工作流',
              link: '/docs/study/web/git-flow',
            },
            {
              text: '配置 Git Husky 代码提交约束',
              link: '/docs/study/web/git-husky',
            },
            {
              text: '解决前端白屏加载时长问题',
              link: '/docs/study/web/vite-build-performance',
            },
            {
              text: 'Promise/A+ 规范',
              link: '/docs/study/web/promise-a+',
            },
            {
              text: 'Plop 简化重复工作流',
              link: '/docs/study/web/plop',
            },
            {
              text: '设计模式之发布订阅模式',
              link: '/docs/study/web/event-emitter',
            },
            {
              text: '你可能真的不会 sticky',
              link: '/docs/study/web/position-sticky',
            },
            {
              text: 'provide/inject 依赖注入',
              link: '/docs/study/web/provide-inject',
            },
            {
              text: '前端导出表格天花板',
              link: '/docs/study/web/exceljs',
            },
          ],
        },
      ],
      // '/docs/life': [
      //   // {
      //   //   text: '生活',
      //   //   collapsed: true,
      //   //   items: [],
      //   // },
      // ],
      // '/docs/book': [
      //   // {
      //   //   text: '书单',
      //   //   collapsed: true,
      //   //   items: [],
      //   // },
      // ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/like-buer/blog' }],

    footer: {
      // message: '不二博客 ©2024 | <a href="https://beian.miit.gov.cn">鄂ICP备19003496号-2</a>',
      copyright: '不二博客 ©2024 | <a href="https://beian.miit.gov.cn">鄂ICP备19003496号-2</a>',
    },

    outlineTitle: '本页目录',

    lastUpdated: {
      text: '最后更新时间',
      formatOptions: {
        locale: 'zh-CN',
        dateStyle: 'long',
        timeStyle: 'medium',
      },
    },

    sidebarMenuLabel: '目录',
    returnToTopLabel: '返回顶部',

    docFooter: { prev: '上一页', next: '下一页' },

    notFound: {
      title: '',
      quote: '页面被外星人劫持了',
      linkText: '返回首页',
    },
  },
  sitemap: {
    hostname: 'https://www.buerblog.cn',
  },

  transformPageData(pageData) {
    pageData.frontmatter.head ??= []
    pageData.frontmatter.keywords ??= '博客,学习,生活,书单,记录,blog'

    // vitepress 不让修改 description
    pageData.frontmatter.head.push([
      'meta',
      { name: 'keywords', content: pageData.frontmatter.keywords + ',不二博客' },
    ])
  },
})
