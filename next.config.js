/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/crs-next-frontend',
  assetPrefix: '/crs-next-frontend/',
};

module.exports = nextConfig;



/**Past code */
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// };

// module.exports = nextConfig;