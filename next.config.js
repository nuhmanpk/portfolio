/** @type {import('next').NextConfig} */
const repo = '/portfolio'; // replace with your repo name prefix ("/REPO_NAME") if different

const nextConfig = {
  output: 'export',
  basePath: repo,
  assetPrefix: `${repo}/`,   // ensures assets are referenced under /portfolio/_next/...
  images: {
    unoptimized: true
  },
};

module.exports = nextConfig;
