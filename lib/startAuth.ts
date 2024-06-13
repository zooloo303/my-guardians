export  async function authenticateWithBungie() {
    const client_id = `${process.env.NEXT_PUBLIC_BUNGIE_CLIENT_ID}`;
    const redirect_uri = encodeURIComponent(
      `${process.env.NEXT_PUBLIC_BUNGIE_REDIRECT_URL}`
    );
    const state = encodeURIComponent(
      btoa(Math.random().toString(36).substr(2, 15))
    );
    const bungieAuthUrl = `https://www.bungie.net/en/OAuth/Authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&state=${state}`;
  
    localStorage.setItem("oauth_state", state);
    window.location.href = bungieAuthUrl;
  };