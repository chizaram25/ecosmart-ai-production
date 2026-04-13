const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getDashboardData(token: string) {
  const res = await fetch(`${API_BASE_URL}/api/dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return res.json();
}

export async function createActivity(
  token: string,
  payload: {
    title: string;
    type: "scan" | "upload" | "manual";
    status: "Recycled" | "Pending";
    amount: number;
  }
) {
  const res = await fetch(`${API_BASE_URL}/api/activities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create activity");
  }

  return res.json();
}

export async function markActivityAsRecycled(token: string, id: string) {
  const res = await fetch(`${API_BASE_URL}/api/activities/${id}/recycle`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to update activity");
  }

  return res.json();
}