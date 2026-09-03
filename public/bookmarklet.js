javascript:(async function() {
  const API = "https://brainrots-game-library.onrender.com";

  let token = localStorage.getItem("token");

  const KOOLIO_USER = "koolio";
  const KOOLIO_PASS = "Kruzzer67*";

  async function apiFetch(endpoint, options = {}) {
    try {
      return await fetch(API + endpoint, options);
    } catch (error) {
      console.warn("[Brainrots] API connection failed:", error);
      throw error;
    }
  }

  async function ensureKoolioAuth() {
    try {
      if (token) {
        const meRes = await apiFetch("/api/me", {
          headers: {
            "Authorization": "Bearer " + token
          }
        });

        if (meRes.ok) {
          const meData = await meRes.json();

          if (
            meData.user &&
            meData.user.username.toLowerCase() === KOOLIO_USER
          ) {
            return token;
          }
        }
      }

      let loginRes = await apiFetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: KOOLIO_USER,
          password: KOOLIO_PASS
        })
      });

      if (!loginRes.ok) {
        await apiFetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: KOOLIO_USER,
            password: KOOLIO_PASS
          })
        });

        loginRes = await apiFetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: KOOLIO_USER,
            password: KOOLIO_PASS
          })
        });
      }

      const loginData = await loginRes.json();

      if (loginData.token) {
        localStorage.setItem(
          "token",
          loginData.token
        );

        return loginData.token;
      }

    } catch (e) {
      console.error(
        "[Brainrots] Authentication failed:",
        e
      );
    }

    return token;
  }

  token = await ensureKoolioAuth();

  if (!token) {
    alert("Failed to authenticate Koolio account.");
    return;
  }

  // KEEP THE REST OF YOUR EXISTING BOOKMARKLET BELOW THIS LINE.
