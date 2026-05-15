import { ref, onUnmounted } from 'vue';
import { usePage } from '@inertiajs/vue3';
import axios from 'axios';

export function useEcho() {
    const page = usePage();
    const onlineUserIds = ref(new Set());
    const conversationChannels = new Map();

    const getEcho = () => window.Echo ?? null;

    const init = () => {
        const config = page.props.broadcast;
        if (!config?.enabled) return null;

        const echo = window.initEcho?.(config);
        if (!echo) return null;

        subscribePresence(echo);
        subscribePresenceUpdates(echo);

        axios.post(route('chat.presence.online')).catch(() => {});

        window.addEventListener('beforeunload', markOffline);

        return echo;
    };

    const markOffline = () => {
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        const body = new URLSearchParams({ _token: token ?? '' });

        if (navigator.sendBeacon) {
            navigator.sendBeacon(route('chat.presence.offline'), body);
            return;
        }

        axios.post(route('chat.presence.offline')).catch(() => {});
    };

    const subscribePresence = (echo) => {
        echo.join('online')
            .here((users) => {
                onlineUserIds.value = new Set(users.map(u => u.id));
            })
            .joining((user) => {
                onlineUserIds.value = new Set([...onlineUserIds.value, user.id]);
            })
            .leaving((user) => {
                const next = new Set(onlineUserIds.value);
                next.delete(user.id);
                onlineUserIds.value = next;
            });
    };

    const subscribePresenceUpdates = (echo) => {
        echo.private('presence-updates')
            .listen('.user.presence', (payload) => {
                const next = new Set(onlineUserIds.value);
                if (payload.online) {
                    next.add(payload.user_id);
                } else {
                    next.delete(payload.user_id);
                }
                onlineUserIds.value = next;
            });
    };

    const subscribeToConversation = (conversationId, handlers) => {
        const echo = getEcho();
        if (!echo || !conversationId) return () => {};

        const channelName = `conversation.${conversationId}`;

        if (conversationChannels.has(channelName)) {
            echo.leave(channelName);
            conversationChannels.delete(channelName);
        }

        const channel = echo.private(channelName)
            .listen('.message.sent', (payload) => handlers.onMessage?.(payload.message))
            .listen('.message.deleted', (payload) => handlers.onDelete?.(payload))
            .listen('.messages.read', (payload) => handlers.onRead?.(payload))
            .listen('.user.typing', (payload) => handlers.onTyping?.(payload));

        conversationChannels.set(channelName, channel);

        return () => {
            echo.leave(channelName);
            conversationChannels.delete(channelName);
        };
    };

    onUnmounted(() => {
        window.removeEventListener('beforeunload', markOffline);
        markOffline();
        conversationChannels.forEach((_, name) => getEcho()?.leave(name));
        conversationChannels.clear();
    });

    return {
        onlineUserIds,
        init,
        subscribeToConversation,
        isUserOnline: (userId) => onlineUserIds.value.has(userId),
    };
}
