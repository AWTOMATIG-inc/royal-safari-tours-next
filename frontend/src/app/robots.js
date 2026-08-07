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
        '/product/cart-view/',
      ],
    },
    sitemap: 'https://royalsafari.tours/sitemap.xml',
  }
}
