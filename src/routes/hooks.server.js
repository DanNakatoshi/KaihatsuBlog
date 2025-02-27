/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    const response = await resolve(event);

    // Set a strong CSP header
    response.headers.set("Content-Security-Policy", 
        "default-src 'self'; " + 
        "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "img-src 'self' data: https://www.google-analytics.com https://pagead2.googlesyndication.com; " +
        "connect-src 'self' https://www.google-analytics.com https://pagead2.googlesyndication.com; " +
        "frame-src https://www.youtube.com https://www.google.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "object-src 'none'; " +
        "base-uri 'self'; " +
        "form-action 'self'; " +
        "upgrade-insecure-requests;"
    );

    return response;
}
