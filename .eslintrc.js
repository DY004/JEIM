module.exports = {
  "env": {
    "node": true,
    "browser": true,
    "es6": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:vue/recommended",
    "airbnb-base"
  ],
  "globals": {
    JE: false,
    require: false,
    Waves: false,
    Ext: false,
    BMap: false,
    Vue: false,
    process: false,
    moment: false,
    '__dirname': false,
    'module': false
  },
  parser: 'vue-eslint-parser',
  "parserOptions": {
    parser: 'babel-eslint',
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  "plugins": [
    "vue",
    'import'
  ],
  rules: {
    'valid-jsdoc': ['warn', { "requireReturn": false, "requireReturnDescription": false }],
    "semi": ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/extensions': ['error', 'ignorePackages', { vue: 'never' }],
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-named-as-default-member': 0,
    'no-var': 'error',
    'no-restricted-syntax': 0,
    'no-prototype-builtins': 0,
    'no-extend-native': 0,
    'no-underscore-dangle': 0,
    'no-bitwise': 0,
    'no-mixed-operators': 0,
    'no-eval': 0,
    'no-plusplus': 0,
    'no-case-declarations': 0,
    'no-useless-escape': 0,
    'no-param-reassign': 0,
    'guard-for-in': 0,
    'max-len': [2, { code: 200 }],
    'no-unused-expressions': 0,
    'eqeqeq': 0,
    'global-require': 0,
    'no-multi-assign': 0,
    'prefer-rest-params': 0,
    'consistent-return': 0,
    'default-case':0
  },
};
