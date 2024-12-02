export default function manifest() {
    return {
      name: 'slimpath',
      short_name: 'slimpath',
      description: 'A Smarter Way to Slim Down',
      start_url: '/' || '/page/football',
      display: 'standalone',
      background_color: '#0a0e1a',
      theme_color: '#0a0e1a',
      icons: [
        {
          src: '/favicon.ico',
          sizes: 'any',
          type: 'image/x-icon',
        },
      ],
    }
  }