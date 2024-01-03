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

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

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
          text: 'Web',
          collapsed: false,
          items: [
            { text: '通过 nvm 管理 Node 版本', link: '/docs/study/web/nvm' },
            { text: '前端导出表格天花板', link: '/docs/study/web/exceljs' },
            { text: 'provide/inject 依赖注入', link: '/docs/study/web/provide-inject' },
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
      copyright: '<a href="https://beian.miit.gov.cn">鄂ICP备19003496号-2</a>',
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
})
