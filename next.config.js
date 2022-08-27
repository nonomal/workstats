/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  images: {
    domains: [
      'firebasestorage.googleapis.com', // Photo URL from Firebase Storage
      'api.producthunt.com', // Image URL from Product Hunt API
      'lh3.googleusercontent.com' // Photo URL from Google account
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: 'default-src "self"; script-src "none"; sandbox;'
  },
  reactStrictMode: true
  // webpack: (config, { isServer }) => {
  //   // Fixes npm packages that depend on `fs` module
  //   if (!isServer) {
  //     config.node = {
  //       fs: 'empty'
  //     }
  //   }

  //   return config
  // },
};

module.exports = nextConfig;
