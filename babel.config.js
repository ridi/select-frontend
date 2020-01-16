module.exports = {
  presets: [
    '@babel/env',
    '@babel/preset-react',
    '@babel/preset-typescript',
    [
      '@emotion/babel-preset-css-prop',
      {
        autoLabel: true,
        labelFormat: '[local]',
        sourceMap: true,
        hoist: true,
      },
    ],
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    ['@babel/plugin-proposal-class-properties', { loose: false }],
    '@babel/plugin-proposal-json-strings',
  ],
};
