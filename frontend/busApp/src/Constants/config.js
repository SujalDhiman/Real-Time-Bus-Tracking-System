
const SERVER_URL = 'http://127.0.0.1:10000';

//Bypass ngrok browser warning will work with localhost as well
const axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
    }
}

export {SERVER_URL, axiosConfig};