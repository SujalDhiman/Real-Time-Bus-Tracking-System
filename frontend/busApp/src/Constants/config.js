const SERVER_URL = 'https://mutually-noble-turtle.ngrok-free.app';

const axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
    }
}

export {SERVER_URL, axiosConfig};