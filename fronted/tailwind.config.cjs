/** @type {import('tailwindcss').Config} */
export default {
    // 核心配置：禁用 Tailwind 的基础样式（预设），
    // 以避免与 Material-UI 的 CssBaseline 组件发生样式冲突。
    corePlugins: {
        preflight: false,
    },
    // 指定 Tailwind 需要扫描以查找类名的文件路径。
    // 这确保了您在这些文件中使用的任何 Tailwind 类都会被正确生成。
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        // 在这里可以扩展 Tailwind 的默认主题，例如添加自定义颜色、字体或断点。
        extend: {},
    },
    plugins: [],
}