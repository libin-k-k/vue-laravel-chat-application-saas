import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

window.Pusher = Pusher;

window.initEcho = (config) => {
    if (!config?.enabled || !config?.key) {
        return null;
    }

    if (window.Echo) {
        return window.Echo;
    }

    window.Echo = new Echo({
        broadcaster: 'pusher',
        key: config.key,
        cluster: config.cluster,
        forceTLS: true,
        authEndpoint: '/broadcasting/auth',
        auth: {
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
            },
        },
    });

    return window.Echo;
};
