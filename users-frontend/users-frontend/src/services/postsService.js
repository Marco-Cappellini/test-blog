import useSWR from "swr"

export async function addPost(data) {

    const response = await fetch(
        "http://localhost:3000/api/posts/post",
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

export async function getPostsByOwner(data) {

    const response = await fetch(
        "http://localhost:3000/api/posts/getByOwner",
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

export async function getAllPosts() {

    const response = await fetch(
        "http://localhost:3000/api/posts/allPosts",
        {
            method: 'GET'
        }
    );

    const message = await response.json();

    if (!response.ok) {
        throw new Error(message.msg || "Errore sconosciuto");
    }

    return message;
}

export async function getPostById(id) {

    const response = await fetch(
        `http://localhost:3000/api/posts/postById/${id}`,
        {
            method: 'GET'
        }
    );

    const message = await response.json();

    if (!response.ok) {
        throw new Error(message.msg || "Errore sconosciuto");
    }

    return message;
}

export async function addReply(data, id) {

    const response = await fetch(
        `http://localhost:3000/api/posts/reply/${id}`, {
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

export async function deletePost(data) {

    const response = await fetch(
        `http://localhost:3000/api/posts/deletePost`, {
        method: 'DELETE',
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

export async function changeReplyStatus(data) {

    const response = await fetch(
        `http://localhost:3000/api/posts/changeReplyStatus`, {
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

export async function deleteReply(data) {

    const response = await fetch(
        `http://localhost:3000/api/posts/deleteReply`, {
        method: 'DELETE',
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

export async function getRepliesByOwner(id) {

    const response = await fetch(
        `http://localhost:3000/api/posts/getReplyByOwner/${id}`,
        {
            method: 'GET'
        }
    );

    const message = await response.json();

    if (!response.ok) {
        throw new Error(message.msg || "Errore sconosciuto");
    }

    return message;
}

export function useAllLiked(id) {

    const { data, mutate, error, isLoading } = useSWR(
        `http://localhost:3000/api/posts/getAllLiked/${id}`
    );

    return { data, mutate, isError: error, isLoading };
}