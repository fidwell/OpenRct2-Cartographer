import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

export default {
  input: "./src/registerPlugin.ts",
  output: {
    file: "./dist/Cartographer.js",
    format: "iife",
  },
  plugins: [
    replace({
      include: "./src/environment.ts",
      preventAssignment: true,
      values: {
        __BUILD_CONFIGURATION__: JSON.stringify("production")
      }
    }),
    typescript(),
    terser({
      format: {
        quote_style: 1,
        wrap_iife: true,
        preamble: "// Mod powered by https://github.com/wisnia74/openrct2-typescript-mod-template - MIT license",
      },
    }),
  ],
};
