// 这个文件是 PostCSS 的标准配置文件。
// PostCSS 是一个用 JavaScript 工具和插件转换 CSS 代码的工具。
// Tailwind CSS 本身就是一个 PostCSS 插件。
module.exports = {
    plugins: [
        require('@tailwindcss/postcss'),
        require('autoprefixer'),
    ]
}

