const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function login(email: string, pass: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password: pass }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (res.status === 200) {
      const data = await res.json();
      return { success: true, ...data };
    }

    return res.json();
  } catch (err) {
    return err;
  }
}

export async function logout() {
  const res = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  return res.json();
}
