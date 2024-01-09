import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Learning Linux",
  description: "About Linux BaseKnowlege",
  base:"/learning-linux/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '返回首页', link: '/' },
    ],

    sidebar: [
      {
        text: '目录与权限',
        items: [
          { text: '文件系统', link: '文件系统' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
