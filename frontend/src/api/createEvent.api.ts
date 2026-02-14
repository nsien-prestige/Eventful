const API_BASE = import.meta.env.VITE_API_URL;

export async function createEvent(token: string, data: any) {
    const res = await fetch(`${API_BASE}/events/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("Failed to create event");
    }

    const responseData = await res.json()

    if (responseData.token) {
        localStorage.setItem("token", responseData.token)
    }

    return responseData;
}
