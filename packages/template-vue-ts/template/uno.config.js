import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetIcons,
} from "unocss";
import presetRemToPx from "@unocss/preset-rem-to-px";
import transformerVariantGroup from "@unocss/transformer-variant-group";

export default defineConfig({
  // ...UnoCSS选项
  presets: [
    // 自带的基础预设
    presetUno(),
    // 将 rem 单位转换为 px 单位
    presetRemToPx({ baseFontSize: 4 }),
    // 将类名转换为属性
    presetAttributify(),
    // 配置图标样式
    presetIcons({
      scale: 1,
      warn: true,
      extraProperties: {
        display: "inline-block",
        verticalAlign: "middle",
      },
    }),
  ],
  // 用于处理 CSS 变体的转换器
  transformers: [transformerVariantGroup()],
  // 快速生成一些常用的 CSS 类名
  shortcuts: [
    {
      "flex-center": "flex flex-items-center flex-justify-center",
    },
  ],
  // 定义一些全局的 CSS 变量
  preflights: [
    {
      getCSS: () => `
        :root {
          --color-primary:#215294;
          --color-success: #008933;
          --color-warning: #ffa703;
          --color-danger: #ff0000;
          --color-info: #909399;
        }
      `,
    },
  ],
  // 主题
  theme: {
    colors: {
      primary: "var(--color-primary)",
      success: "var(--color-success)",
      warning: "var(--color-warning)",
      danger: "var(--color-danger)",
      info: "var(--color-info)",
    },
  },
});