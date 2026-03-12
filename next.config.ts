import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Disabled to eliminate StrictMode double-invoke as a variable during debugging.
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    // Ignore warnings/errors from FFmpeg about dynamic expressions
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/@ffmpeg/,
      parser: {
        amd: false,
      },
    });

    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /node_modules\/@ffmpeg/ },
      /Cannot find module as expression is too dynamic/,
    ];

    return config;
  },
};

export default nextConfig;
