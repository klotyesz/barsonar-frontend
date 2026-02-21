import type { User } from "../interfaces/User";

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

export async function me() {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      // method: "GET",
      // headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      return data as User;
    }

    return res.json();
  } catch (err) {
    return err;
  }
}

export async function signup(un: string, e: string, p: string, a?: number) {
  try {
    let signupData = null;

    if (a == 0) {
      signupData = JSON.stringify({
        userName: un,
        email: e,
        password: p,
      });
    } else {
      signupData = JSON.stringify({
        userName: un,
        email: e,
        password: p,
        age: a,
      });
    }

    const res = await fetch(`${API_BASE_URL}/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: signupData,
    });

    const data = await res.json();

    if (!data.ok) {
      throw data.message;
    } else {
      return data;
    }
  } catch (err: any) {
    return err;
  }
}

export async function addInterest(interest: string) {
  const res = await fetch(`${API_BASE_URL}/user/addInterest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ interest }),
  });
  return res.json();
}

export async function logout() {
  const res = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  return res.json();
}
