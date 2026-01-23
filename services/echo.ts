import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// @ts-ignore
window.Pusher = Pusher;

const pusherScheme = import.meta.env.VITE_PUSHER_SCHEME || 'https';
const pusherPort = Number(import.meta.env.VITE_PUSHER_PORT || (pusherScheme === 'https' ? '443' : '6001'));

const echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY || 'app-key',
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1',
    forceTLS: pusherScheme === 'https',
    wsHost: import.meta.env.VITE_PUSHER_HOST,
    wsPort: pusherPort,
    wssPort: pusherPort,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${import.meta.env.VITE_API_BASE_URL || '/api'}/broadcasting/auth`,
    auth: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json',
        },
    },
});

export default echo;
