/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Faster builds
  typescript: {
    ignoreBuildErrors: false, // Keep type checking but optimize
  },
  eslint: {
    ignoreDuringBuilds: false, // Keep linting but optimize
  },
  // Experimental features for faster builds
  experimental: {
    turbo: {
      loaders: {
        '.svg': ['@svgr/webpack'],
      },
    },
    // Enable SWC compiler optimizations
    swcPlugins: [],
    // Faster refresh
    optimizeServerReact: true,
  },
  webpack: (config, { dev, isServer }) => {
      // Add externals
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
      });
      
      // Enable experiments
      config.experiments = {
        asyncWebAssembly: true,
        layers: true,
        topLevelAwait: true
      };

      // Optimize for development builds
      if (dev) {
        config.watchOptions = {
          poll: 1000,
          aggregateTimeout: 300,
          ignored: /node_modules/,
        };
      }

      // Cache optimizations
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: ['next.config.mjs']
        }
      };

      return config;
    },
    // Ensure client-side only rendering
    async redirects() {
      return [
        {
          source: '/server-side-page',
          destination: '/',
          permanent: true,
        },
      ];
    },
    images: {
      domains: ['statutory-plum-seahorse.myfilebase.com'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'statutory-plum-seahorse.myfilebase.com',
          port: '',
          pathname: '/ipfs/**',
        }
      ],
      // Optimize image loading
      formats: ['image/webp', 'image/avif'],
      minimumCacheTTL: 60,
      deviceSizes: [320, 420, 768, 1024, 1200],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    // Add compression
    compress: true,
};

export default nextConfig;