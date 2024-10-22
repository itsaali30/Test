exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    headers: {
      'Cache-Control': 'public, max-age=300', // Enable CDN caching for 5 minutes
    },
    body: JSON.stringify({ message: "Hello from Netlify API with CDN caching!" }),
  };
};
