export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/api/',
        '/login/',
        '/register/',
      ],
    },
    sitemap: 'https://royalsafari.tours/sitemap.xml',
  }
}
