

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function addInterest(interest: string) {
  const res = await fetch(`${API_BASE_URL}/user/addInterest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ interest }),
  });
  return res.json();
}

export async function getInterests() {
  const res = await fetch(`${API_BASE_URL}/user/interests`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return res.json();
}
