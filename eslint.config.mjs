import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginAstro from "eslint-plugin-astro";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      // ปรับเองตรงนี้ เช่น
      // 'astro/no-set-html-directive': 'error',
    },
  },
  {
    // กัน lint โฟลเดอร์ build
    ignores: ["dist/", ".astro/", "node_modules/"],
  },
];
