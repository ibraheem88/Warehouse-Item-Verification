{
  "extends": ["airbnb", "plugin:prettier/recommended", "prettier/react"],
  "parser": "babel-eslint",
  "rules": {
      "react/jsx-filename-extension": ["warn", { "extensions": [".js", ".jsx"] }],
      "no-use-before-define": ["error", { "variables": false }],
      "react/forbid-prop-types": ["error", { "forbid": ["any"], "checkContextTypes": false, "checkChildContextTypes": false }],
      "react/prop-types": "off",
      "no-empty": ["error", { "allowEmptyCatch": true }],
      "camelcase": "off",
      "no-underscore-dangle": "off",
      "react/no-array-index-key": "off",
      "no-bitwise": "off",
      "no-extend-native": ["error", { "exceptions": ["String", "Array"] }],
      "import/no-extraneous-dependencies": ["off", {"devDependencies": true, "optionalDependencies": true, "peerDependencies": true}],
      "jsx-a11y/accessible-emoji": "off",
      "import/prefer-default-export": "off",
      "no-multi-str": "off",
      "no-unused-expressions": "off",
      "no-nested-ternary": "off",
      "array-callback-return": 'off',
      "prettier/prettier": [
        "error",
        {
          "endOfLine": "auto"
        }
      ]
  }
}