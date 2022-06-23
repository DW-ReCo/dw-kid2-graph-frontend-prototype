module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)?$/,
      use: ["ts-loader"],
    });

    return config;
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/app",
        permanent: true,
      },
    ];
  },
};
