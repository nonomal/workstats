/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com', 'api.producthunt.com'],
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
