import useSWR from "swr"

export async function login(data) {

    const response = await fetch(
        `${import.meta.env.VITE_ENDPOINT}/api/users/login`,
        {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    );

    const message = await response.json();

    if (!response.ok) {
        throw new Error(message.msg || "Errore sconosciuto");
    }

    return message;
}

export async function updateUser(data) {

    const response = await fetch(
        "http://localhost:3000/api/users/update",
        {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    );

    const message = await response.json();

    if (!response.ok) {
        throw new Error(message.msg || "Errore sconosciuto");
    }

    return message;
}

export async function managerUpdate(data) {

    const response = await fetch(
        "http://localhost:3000/api/users/managerUpdate",
        {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    );

    const message = await response.json();

    if (!response.ok) {
        throw new Error(message.msg || "Errore sconosciuto");
    }

    return message;
}

export async function subscribe(data) {

    const response = await fetch(
        "http://localhost:3000/api/users/subscribe",
        {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    );

    const message = await response.json();

    if (!response.ok) {
        throw new Error(message.msg || "Errore sconosciuto");
    }

    return message;
}

export function useAllUsers() {

    const { data, mutate, error, isLoading } = useSWR(
        "http://localhost:3000/api/users/"
    );

    return { data, mutate, isError: error, isLoading };
}

export function useUserById(id) {

    const { data, mutate, error, isLoading } = useSWR(
        `http://localhost:3000/api/users/${id}`
    );

    return { data, mutate, isError: error, isLoading };
}

export async function deleteUser(id) {

    const response = await fetch(
        `http://localhost:3000/api/users/${id}`,
        {
            method: 'DELETE'
        }
    );

    const message = await response.json();

    if (!response.ok) {
        throw new Error(message.msg || "Errore sconosciuto");
    }

    return message;
}

export async function likePost(data) {

    const response = await fetch(
        "http://localhost:3000/api/users/like",
        {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    );

    const message = await response.json();

    if (!response.ok) {
        throw new Error(message.msg || "Errore sconosciuto");
    }

    return message;
}

export async function dislikePost(data) {

    const response = await fetch(
        "http://localhost:3000/api/users/dislike",
        {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    );

    const message = await response.json();

    if (!response.ok) {
        throw new Error(message.msg || "Errore sconosciuto");
    }

    return message;
}

export async function checkIfLiked(data) {

    const response = await fetch(
        "http://localhost:3000/api/users/checkIfLiked",
        {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    );

    const message = await response.json();

    if (!response.ok) {
        throw new Error(message.msg || "Errore sconosciuto");
    }

    return message;
}