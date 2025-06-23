import useSWR from "swr"

const endpoint = import.meta.env.VITE_ENDPOINT

export async function addPost(data) {

    const response = await fetch(
        `${endpoint}/api/posts/post`,
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

export function usePostsByOwner(body) {

    const fetcher = ([url, options]) => fetch(url, options).then(res => res.json());

    const { data, mutate, error, isLoading } = useSWR(
        [`${endpoint}/api/posts/getByOwner`,
            {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(body),
            }],
        fetcher,
        {
            refreshInterval: 4000
        }
    );

    return { data, mutate, isError: error, isLoading };
}

export function useAllPosts() {

    const { data, mutate, error, isLoading } = useSWR(
        `${endpoint}/api/posts/allPosts`, {
        refreshInterval: 4000
    }
    );

    return { data, mutate, isError: error, isLoading };
}

export function usePostById(id) {

    const { data, mutate, error, isLoading } = useSWR(
        `${endpoint}/api/posts/postById/${id}`
    );

    return { data, mutate, isError: error, isLoading };
}

export async function addReply(data, id) {

    const response = await fetch(
        `${endpoint}/api/posts/reply/${id}`, {
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
        `${endpoint}/api/posts/deletePost`, {
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
        `${endpoint}/api/posts/changeReplyStatus`, {
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
        `${endpoint}/api/posts/deleteReply`, {
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

export function useRepliesByOwner(id) {

    const { data, mutate, error, isLoading } = useSWR(
        `${endpoint}/api/posts/getReplyByOwner/${id}`
    );

    return { data, mutate, isError: error, isLoading };
}

export function useAllLiked(id) {

    const { data, mutate, error, isLoading } = useSWR(
        `${endpoint}/api/posts/getAllLiked/${id}`
    );

    return { data, mutate, isError: error, isLoading };
}