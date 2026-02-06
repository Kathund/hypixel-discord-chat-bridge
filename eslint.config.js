/* eslint-disable */
import globals from "globals";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier";
import sortImports from "@j4cobi/eslint-plugin-sort-imports";
import js from "@eslint/js";
import { globalIgnores } from "eslint/config";

export default [
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  prettier,
  globalIgnores(["./data/", "./auth-cache/"]),
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2026,
      sourceType: "module",
      globals: {
        ...globals.es2026,
        ...globals.node,
        bot: "readonly",
        client: "readonly",
        guild: "readonly"
      }
    },
    plugins: { js, "sort-imports": sortImports },
    rules: {
      "sort-imports/sort-imports": ["error", { ignoreCase: false, ignoreMemberSort: false, memberSyntaxSortOrder: ["all", "single", "multiple", "none"] }],
      "import/enforce-node-protocol-usage": ["error", "always"],
      "no-constant-condition": ["error", { checkLoops: false }],
      "no-extend-native": ["warn", { exceptions: ["Object"] }],
      "prefer-const": ["warn", { destructuring: "all" }],
      "import/no-cycle": ["error", { maxDepth: 1 }],
      curly: ["warn", "multi-line", "consistent"],
      "no-template-curly-in-string": "error",
      "quote-props": ["error", "as-needed"],
      "import/newline-after-import": "warn",
      "no-useless-constructor": "error",
      "no-useless-assignment": "error",
      "no-inner-declarations": "error",
      "import/no-deprecated": "error",
      "no-implicit-coercion": "error",
      "no-use-before-define": "warn",
      "no-unneeded-ternary": "error",
      "default-param-last": "error",
      "import/no-commonjs": "error",
      "one-var": ["warn", "never"],
      "no-empty-function": "error",
      "no-useless-return": "error",
      "no-useless-rename": "warn",
      "no-useless-concat": "warn",
      "no-throw-literal": "error",
      "default-case-last": "warn",
      "no-self-compare": "error",
      "no-new-wrappers": "error",
      "no-lone-blocks": "error",
      "no-undef-init": "error",
      "no-else-return": "warn",
      "no-sequences": "warn",
      "no-multi-str": "warn",
      "no-lonely-if": "warn",
      "import/first": "error",
      "require-await": "warn",
      "default-case": "error",
      "dot-notation": "error",
      "no-new-func": "error",
      camelcase: "warn",
      "no-var": "warn",
      eqeqeq: "warn"

      //   "import/no-anonymous-default-export": "error",
      //   "import/no-extraneous-dependencies": "error",
      //   "import/no-useless-path-segments": "error",
      //   "import/prefer-default-export": "error",
      //   "import/no-dynamic-require": "warn",
      //   "import/no-absolute-path": "error",
      //   "import/no-named-default": "error",
      //   "import/no-self-import": "error",
      //   "import/no-namespace": "error",
      //   "import/exports-last": "error"
    }
  }
];
