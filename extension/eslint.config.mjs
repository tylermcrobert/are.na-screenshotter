import globals from "globals"
import react from "eslint-plugin-react"
import tseslint from "typescript-eslint"
import prettier from "eslint-config-prettier"

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [".plasmo/**", "build/**", "node_modules/**", "patches/**"]
  },
  { files: ["**/*.{js,mjs,cjs,ts,tsx}"] },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.webextensions,
        chrome: "readonly"
      }
    }
  },
  ...tseslint.configs.recommended,
  {
    ...react.configs.flat.recommended,
    settings: { react: { version: "detect" } }
  },
  react.configs.flat["jsx-runtime"],
  prettier
]
