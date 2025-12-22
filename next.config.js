/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // ⚠️ If deploying to a GitHub Pages Project site (e.g. username.github.io/portfolio),
  // you MUST set the basePath to '/portfolio'.
  // If deploying to a User site (username.github.io), leave it as is or empty string.
  basePath: '/portfolio',
};
module.exports = nextConfig;
