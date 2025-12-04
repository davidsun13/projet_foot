export async function fetchAuth(url: string, options: RequestInit = {}) {
  const accessToken = localStorage.getItem("access_token");

  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  });

  if (res.status === 401) {
    const refreshRes = await fetch("http://localhost:1234/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) {
      // refresh impossible → on déconnecte
      localStorage.removeItem("access_token");
      window.location.href = "/connexion";
      return res;
    }

    const refreshData = await refreshRes.json();

    localStorage.setItem("access_token", refreshData.accessToken);

    // On rejoue la requête initiale avec le nouveau token
    return await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${refreshData.accessToken}`,
      },
    });
  }

  return res;
}
