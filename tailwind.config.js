// const defaultTheme = require("tailwindcss/defaultTheme");
// const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
    // './node_modules/flowbite/**/*.js',
    // './node_modules/@themesberg/flowbite/*/.js',
    // './node_modules/@themesberg/flowbite/**/*.js',
  ],
  theme: {
    extend: {
      height: {
        88: '22rem',
        92: '23rem',
        93: '23.25rem',
        94: '23.5rem',
        95: '23.75rem',
        100: '25rem',
        101: '25.25rem',
        102: '25.5rem',
        103: '25.75rem',
        104: '26rem',
        108: '27rem',
        112: '28rem',
        116: '29rem',
        120: '30rem',
        124: '31rem',
        128: '32rem',
        132: '33rem',
        136: '34rem',
        140: '35rem',
        144: '36rem',
        148: '37rem',
        152: '38rem'
      }
    }
  },
  plugins: [
    // require('flowbite/plugin'),
    // require('@themesberg/flowbite/plugin'),
  ]
};
