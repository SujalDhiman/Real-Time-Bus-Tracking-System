
const SERVER_URL = 'https://mutually-noble-turtle.ngrok-free.app';

//Bypass ngrok browser warning will work with localhost as well
const axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
    }
}

export {SERVER_URL, axiosConfig};