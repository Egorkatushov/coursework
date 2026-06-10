const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  // Добавляем настройки для webpack
  webpack: (config, { isServer }) => {
    if (!isServer) {

      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        http: false,
        https: false,
        stream: false,
        crypto: false,
        'supports-color': false,
      };
    }
    return config;
  },

  swcMinify: true,
};

module.exports = nextConfig;