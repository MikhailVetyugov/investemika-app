import type { NextConfig } from "next";

import { GORDON_CALCULATOR_URL } from "./constants/urls";

const nextConfig: NextConfig = {
  htmlLimitedBots: /GoogleBot|[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight/i,
  async rewrites() {
    return [
      {
        source: GORDON_CALCULATOR_URL,
        destination: '/gordon-calculator',
      },
    ];
  },
};

export default nextConfig;
