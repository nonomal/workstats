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
        100: '25rem',
        104: '26rem',
        108: '27rem',
        112: '28rem',
        116: '29rem',
        120: '30rem',
        124: '31rem',
        128: '32rem'
      }
    }
  },
  plugins: [
    // require('flowbite/plugin'),
    // require('@themesberg/flowbite/plugin'),
  ]
};
