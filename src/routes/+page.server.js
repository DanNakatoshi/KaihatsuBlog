import { redirect } from "@sveltejs/kit";

/** @type {import('./$types').ServerLoad} */
export async function load({ url }) {
  // Extract access token and refresh token from URL query params
  const access_token = url.searchParams.get("access_token");
  const refresh_token = url.searchParams.get("refresh_token");
  const type = url.searchParams.get("type");

  // Check if the reset token exists and is a recovery type
  if (access_token && refresh_token && type === "recovery") {
    // Redirect to password reset page with tokens
    throw redirect(302, `/auth/password-reset?access_token=${access_token}&refresh_token=${refresh_token}`);
  }

  // If no valid token, just load the page normally
  return {};
}
