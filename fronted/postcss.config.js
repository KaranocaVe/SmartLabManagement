// 这个文件是 PostCSS 的标准配置文件。
// PostCSS 是一个用 JavaScript 工具和插件转换 CSS 代码的工具。
// Tailwind CSS 本身就是一个 PostCSS 插件。
export default {
    plugins: {
        // 启用 Tailwind CSS 插件
        tailwindcss: {},
        // 启用 Autoprefixer 插件，它会自动为 CSS 规则添加浏览器厂商前缀
        autoprefixer: {},
    },
}
