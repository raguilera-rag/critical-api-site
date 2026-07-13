// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://criticalapiservices.com',
  integrations: [
    sitemap({
      filter: (page) => ![
        'https://criticalapiservices.com/404/',
      ].includes(page)
    })
  ]
});
