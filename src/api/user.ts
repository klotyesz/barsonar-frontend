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

export async function deleteInterest(id: number) {
  const res = await fetch(`${API_BASE_URL}/user/deleteInterest/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.json();
}

export async function updateUser(id: number, data: { userName?: string }) {
  const res = await fetch(`${API_BASE_URL}/user/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function searchByUsername(userName: string) {
  const res = await fetch(
    `${API_BASE_URL}/user/searchByName/${encodeURIComponent(userName)}`,
    { credentials: "include" }
  );
  return res.json();
}

export async function addFriend(userId: number) {
  const res = await fetch(`${API_BASE_URL}/user/addFriend/${userId}`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
}

export async function getFriends() {
  const res = await fetch(`${API_BASE_URL}/user/friends`, {
    credentials: "include",
  });
  return res.json();
}

export async function getPendingFriendRequests() {
  const res = await fetch(`${API_BASE_URL}/user/pendingFriends`, {
    credentials: "include",
  });
  return res.json();
}

export async function dealWithFriendRequest(
  receivedFromUserId: number,
  accepted: boolean
) {
  const res = await fetch(`${API_BASE_URL}/user/dealWithFriendRequest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      recievedFromUserId: receivedFromUserId,
      accepted,
    }),
  });
  return res.json();
}

export async function getRecommendationsByInterest() {
  const res = await fetch(`${API_BASE_URL}/user/recommendation`, {
    credentials: "include",
  });
  return res.json();
}

export async function getRecommendationsByAge() {
  const res = await fetch(`${API_BASE_URL}/user/recommendation/age`, {
    credentials: "include",
  });
  return res.json();
}
