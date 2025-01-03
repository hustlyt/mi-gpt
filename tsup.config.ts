import { defineConfig } from "tsup";

export default defineConfig(() => ({
  entry: ["src/index.ts"],
  outDir: "dist",
  target: "node16",
  platform: "node",
  format: ["esm", "cjs"],
  sourcemap: false,
  treeshake: true,
  minify: false,
  clean: true,
  shims: true,
  dts: true, // Generate declaration file
  publicDir: 'public', // 将 public 目录下的文件复制到 dist
}));
