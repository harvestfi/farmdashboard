module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {},
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    /* JS rules */
    'arrow-parens': ['error', 'as-needed'],
    'max-classes-per-file': ['warn', 1],
    'prefer-promise-reject-errors': ['error', {allowEmptyReject: true}],
    'comma-dangle': [1, 'always-multiline'],
    'max-len': ['error', {code: 140}],
    'class-methods-use-this': 0,
    camelcase: ['error', {
      ignoreImports: true,
      ignoreDestructuring: true,
      properties: 'never',
    }],
    'object-curly-spacing': 0,
    'operator-linebreak': 0,
    'no-plusplus': 0,
    'no-use-before-define': 0,
    'lines-between-class-members': 0,
    'linebreak-style': 0,
    'no-confusing-arrow': 0,
    'no-return-assign': 0,
    'no-param-reassign': 0,
    'consistent-return': 0,
    'arrow-body-style': 0,
    'dot-notation': 0, //
    'no-lonely-if': 0, // incorrect work IMO
    'no-useless-constructor': 0, // don't correct work with: constructor(private service: ServiceSome){}
    'object-curly-newline': 0, // tmp while not work import-destructuring-spacing
    semi: [1, 'always'],
  },
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      plugins: ['@typescript-eslint', '@angular-eslint'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: 'rxjs/Rx',
                message: "Please import directly from 'rxjs' instead",
              },
            ],
          },
        ],
        'no-restricted-syntax': [
          'error',
          {
            selector:
              'CallExpression[callee.object.name="console"][callee.property.name=/^(debug|info|time|timeEnd|trace)$/]',
            message: 'Unexpected property on console object was called',
          },
        ],

        '@angular-eslint/component-class-suffix': 'error',
        '@angular-eslint/component-selector': [
          'error',
          {type: 'element', prefix: ['app', 'ag', 'ui'], style: 'kebab-case'},
        ],
        '@angular-eslint/contextual-lifecycle': 'error',
        '@angular-eslint/directive-class-suffix': 'error',
        '@angular-eslint/directive-selector': [
          'error',
          {type: 'attribute', prefix: 'app', style: 'camelCase'},
        ],
        '@angular-eslint/no-conflicting-lifecycle': 'error',
        '@angular-eslint/no-inputs-metadata-property': 'error',
        '@angular-eslint/no-output-native': 'error',
        '@angular-eslint/no-output-on-prefix': 'error',
        '@angular-eslint/no-output-rename': 'error',
        '@angular-eslint/no-outputs-metadata-property': 'error',
        '@angular-eslint/no-pipe-impure': 'error',
        '@angular-eslint/no-queries-metadata-property': 'error',
        '@angular-eslint/use-lifecycle-interface': 'warn',
        '@angular-eslint/use-pipe-transform-interface': 'error',

        '@typescript-eslint/array-type': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/member-ordering': [
          'error',
          {
            default: [
              'static-field',
              'instance-field',
              'static-method',
              'instance-method',
            ],
          },
        ],
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-inferrable-types': [
          'error',
          {
            ignoreParameters: true,
          },
        ],
        // "@typescript-eslint/no-explicit-any": "error",
        // implementations differ or ESLint version is missing functionality
        '@typescript-eslint/no-unused-vars': 'error',
        // need to correct work @typescript-eslint/no-empty-function with: constructor(private service: SomeService){}
        'no-empty-function': 'off',
        '@typescript-eslint/no-empty-function': 'error'
      },
    },
    {
      files: ['*.component.html'],
      parser: '@angular-eslint/template-parser',
      plugins: ['@angular-eslint/template'],
      rules: {
        '@angular-eslint/template/banana-in-a-box': 'error',
        '@angular-eslint/template/no-negated-async': 'error',
      },
    },
  ],
}
