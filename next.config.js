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
  reactStrictMode: false // If true, React executes useEffect twice for bug detection. Hence, the access code exchange API with Atlassian will result in an error, so we set this to false.
};

module.exports = nextConfig;
