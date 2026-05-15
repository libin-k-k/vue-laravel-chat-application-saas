import { ref, computed, watch } from 'vue';
import axios from 'axios';
import { usePage } from '@inertiajs/vue3';
import { useEcho } from '@/Composables/useEcho';

function isMessageMine(msg, authUserId) {
    if (authUserId == null) {
        return Boolean(msg.is_mine);
    }

    return Number(msg.sender_id) === Number(authUserId);
}

function mapMessage(msg, authUserId) {
    const mine = isMessageMine(msg, authUserId);

    return {
        id: msg.id,
        conversationId: msg.conversation_id,
        senderId: mine ? 'me' : msg.sender_id,
        type: msg.type,
        text: msg.text,
        voice: msg.voice ?? null,
        image: msg.image ?? null,
        time: msg.time,
        date: msg.date,
        createdAt: msg.created_at ?? null,
        status: msg.status,
        isDeleted: msg.is_deleted ?? Boolean(msg.deleted_at),
        senderName: msg.sender_name ?? null,
        senderAvatar: msg.sender_avatar ?? null,
    };
}

function mapConversation(item, onlineUserIds) {
    return {
        id: item.user_id,
        conversationId: item.conversation_id,
        userId: item.user_id,
        name: item.name,
        username: item.username,
        avatar: item.avatar,
        online: onlineUserIds.has(item.user_id) || item.online,
        lastMessage: item.last_message,
        lastTime: item.last_time,
        unread: item.unread ?? 0,
        isMine: item.is_mine ?? false,
        muted: item.muted ?? false,
        typing: false,
        lastSeen: item.last_seen,
    };
}

export function useChat() {
    const page = usePage();
    const authUser = computed(() => page.props.auth?.user ?? null);
    const authUserId = computed(() => authUser.value?.id);
    const authAvatar = computed(() => authUser.value?.profile_photo_url ?? null);
    const authName = computed(() => authUser.value?.name ?? 'You');

    const echo = useEcho();

    const contacts = ref([]);
    const selectedContact = ref(null);
    const searchQuery = ref('');
    const mobileView = ref('list');
    const messagesByConversation = ref({});
    const messagesMeta = ref({});
    const loadingConversations = ref(false);
    const loadingMessages = ref(false);
    const loadingOlder = ref(false);
    const sending = ref(false);

    const conversationUnsubs = new Map();
    let typingStopTimer = null;

    const isChatOpen = (conversationId) => {
        if (selectedContact.value?.conversationId !== conversationId) {
            return false;
        }

        if (typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches) {
            return true;
        }

        return mobileView.value === 'chat';
    };

    const patchContact = (conversationId, patch) => {
        const index = contacts.value.findIndex(c => c.conversationId === conversationId);
        if (index === -1) return null;

        const updated = { ...contacts.value[index], ...patch };
        const rest = contacts.value.filter((_, i) => i !== index);

        contacts.value = [updated, ...rest];

        if (selectedContact.value?.conversationId === conversationId) {
            selectedContact.value = { ...selectedContact.value, ...patch };
        }

        return updated;
    };

    const messages = computed(() => {
        const id = selectedContact.value?.conversationId;
        return id ? (messagesByConversation.value[id] ?? []) : [];
    });

    const hasMoreMessages = computed(() => {
        const id = selectedContact.value?.conversationId;
        return id ? (messagesMeta.value[id]?.hasMore ?? false) : false;
    });

    const fetchConversations = async () => {
        loadingConversations.value = true;
        try {
            const { data } = await axios.get(route('chat.conversations.index'));
            const online = echo.onlineUserIds.value;
            contacts.value = (data.conversations ?? []).map(c => mapConversation(c, online));
            syncConversationSubscriptions();
        } catch {
            contacts.value = [];
        } finally {
            loadingConversations.value = false;
        }
    };

    const fetchMessages = async (conversationId, beforeId = null) => {
        const isOlder = Boolean(beforeId);
        if (isOlder) {
            loadingOlder.value = true;
        } else {
            loadingMessages.value = true;
        }

        try {
            const { data } = await axios.get(route('chat.messages.index', conversationId), {
                params: beforeId ? { before_id: beforeId } : {},
            });

            const mapped = (data.messages ?? []).map(m => mapMessage(m, authUserId.value));
            const existing = messagesByConversation.value[conversationId] ?? [];

            messagesByConversation.value[conversationId] = isOlder
                ? [...mapped, ...existing]
                : mapped;

            messagesMeta.value[conversationId] = {
                hasMore: data.has_more ?? false,
                oldestId: data.oldest_id ?? mapped[0]?.id ?? null,
            };

            if (!isOlder && isChatOpen(conversationId) && mapped.length > 0) {
                const lastId = mapped[mapped.length - 1].id;
                await markConversationRead(conversationId, lastId);
            }
        } finally {
            loadingMessages.value = false;
            loadingOlder.value = false;
        }
    };

    const loadOlderMessages = async () => {
        const contact = selectedContact.value;
        if (!contact?.conversationId || loadingOlder.value) return;

        const meta = messagesMeta.value[contact.conversationId];
        if (!meta?.hasMore || !meta.oldestId) return;

        await fetchMessages(contact.conversationId, meta.oldestId);
    };

    const markConversationRead = async (conversationId, messageId) => {
        if (!conversationId || !messageId || !isChatOpen(conversationId)) return;

        try {
            await axios.post(route('chat.conversations.read', conversationId), {
                message_id: messageId,
            });

            patchContact(conversationId, { unread: 0 });
        } catch {
            /* ignore */
        }
    };

    const setContactTyping = (conversationId, userId, typing) => {
        const contact = contacts.value.find(c => c.conversationId === conversationId);
        if (!contact || Number(contact.userId) !== Number(userId)) return;

        patchContact(conversationId, { typing });
    };

    const upsertConversationFromMessage = (message, isMine) => {
        const convId = message.conversation_id ?? message.conversationId;
        const existing = contacts.value.find(c => c.conversationId === convId);

        const preview = message.is_deleted
            ? 'Message deleted'
            : message.type === 'voice'
                ? '🎤 Voice message'
                : (message.text ?? message.body);

        if (existing) {
            const unread = !isMine && !isChatOpen(convId)
                ? (existing.unread ?? 0) + 1
                : (existing.unread ?? 0);

            patchContact(convId, {
                lastMessage: preview,
                lastTime: message.time ?? existing.lastTime,
                isMine,
                unread,
                typing: false,
            });
            return;
        }

        fetchConversations();
    };

    const appendMessage = (rawMessage) => {
        const msg = mapMessage(rawMessage, authUserId.value);
        const convId = msg.conversationId;

        if (!messagesByConversation.value[convId]) {
            messagesByConversation.value[convId] = [];
        }

        const list = messagesByConversation.value[convId] ?? [];
        if (!list.some(m => m.id === msg.id)) {
            messagesByConversation.value[convId] = [...list, msg];
        }

        upsertConversationFromMessage(rawMessage, msg.senderId === 'me');

        if (isChatOpen(convId) && msg.senderId !== 'me') {
            markConversationRead(convId, msg.id);
        }
    };

    const markMessageDeleted = (payload) => {
        const convId = payload.conversation_id;
        const list = messagesByConversation.value[convId];
        if (!list) return;

        const msg = list.find(m => m.id === payload.message_id);
        if (msg) {
            msg.isDeleted = true;
            msg.text = null;
            msg.voice = null;
            msg.image = null;
        }

        const contact = contacts.value.find(c => c.conversationId === convId);
        if (contact && contact.lastMessage && !contact.lastMessage.startsWith('🎤')) {
            contact.lastMessage = 'Message deleted';
        }
    };

    const applyMessagesRead = (payload) => {
        if (payload.reader_id === authUserId.value) return;

        const convId = payload.conversation_id;
        const list = messagesByConversation.value[convId];
        if (!list) return;

        list.forEach((msg) => {
            if (msg.senderId === 'me' && msg.id <= payload.up_to_message_id) {
                msg.status = 'read';
            }
        });
    };

    const handleIncomingMessage = (message) => {
        if (isMessageMine(message, authUserId.value)) return;
        appendMessage(message);
    };

    const syncConversationSubscriptions = () => {
        const activeIds = new Set(
            contacts.value.map(c => c.conversationId).filter(Boolean),
        );

        for (const [id, unsub] of conversationUnsubs) {
            if (!activeIds.has(id)) {
                unsub();
                conversationUnsubs.delete(id);
            }
        }

        contacts.value.forEach((contact) => {
            const id = contact.conversationId;
            if (!id || conversationUnsubs.has(id)) return;

            const unsub = echo.subscribeToConversation(id, {
                onMessage: handleIncomingMessage,
                onDelete: markMessageDeleted,
                onRead: applyMessagesRead,
                onTyping: (payload) => {
                    setContactTyping(payload.conversation_id, payload.user_id, payload.typing);
                },
            });

            conversationUnsubs.set(id, unsub);
        });
    };

    const selectContact = async (contact) => {
        selectedContact.value = contact;
        mobileView.value = 'chat';

        patchContact(contact.conversationId, { unread: 0, typing: false });

        if (contact.conversationId) {
            await fetchMessages(contact.conversationId);
        }
    };

    const goBack = () => {
        if (typingStopTimer) {
            clearTimeout(typingStopTimer);
            typingStopTimer = null;
        }

        const openId = selectedContact.value?.conversationId;
        if (openId) {
            axios.post(route('chat.conversations.typing', openId), { typing: false }).catch(() => {});
        }

        selectedContact.value = null;
        mobileView.value = 'list';
    };

    const startConversation = async (user) => {
        try {
            const { data } = await axios.post(route('chat.conversations.store'), {
                user_id: user.id,
            });

            const online = echo.onlineUserIds.value;
            const mapped = mapConversation(data.conversation, online);

            let contact = contacts.value.find(c => c.conversationId === mapped.conversationId);
            if (!contact) {
                contacts.value.unshift(mapped);
                contact = mapped;
            }

            syncConversationSubscriptions();

            if (!messagesByConversation.value[contact.conversationId]) {
                messagesByConversation.value[contact.conversationId] = [];
            }

            await selectContact(contact);
        } catch {
            /* ignore */
        }
    };

    const sendMessage = async (text) => {
        const contact = selectedContact.value;
        if (!contact?.conversationId || !text.trim() || sending.value) return;

        sending.value = true;
        try {
            const { data } = await axios.post(
                route('chat.messages.store', contact.conversationId),
                { body: text.trim() },
            );
            appendMessage(data.message);
        } finally {
            sending.value = false;
        }
    };

    const sendVoiceMessage = async ({ blob, duration }) => {
        const contact = selectedContact.value;
        if (!contact?.conversationId || !blob || sending.value) return;

        sending.value = true;
        const form = new FormData();
        form.append('voice', blob, `voice-${Date.now()}.webm`);
        form.append('duration', String(Math.round(duration)));

        try {
            const { data } = await axios.post(
                route('chat.messages.store', contact.conversationId),
                form,
                { headers: { 'Content-Type': 'multipart/form-data' } },
            );
            appendMessage(data.message);
        } finally {
            sending.value = false;
        }
    };

    const canDeleteMessage = (message) => {
        if (!message || message.senderId !== 'me' || message.isDeleted) return false;
        if (!message.createdAt) return true;

        const created = new Date(message.createdAt).getTime();
        return Date.now() - created <= 5 * 60 * 1000;
    };

    const deleteMessage = async (messageId) => {
        const contact = selectedContact.value;
        if (!contact?.conversationId) return;

        try {
            await axios.delete(route('chat.messages.destroy', messageId));
            markMessageDeleted({
                conversation_id: contact.conversationId,
                message_id: messageId,
            });
        } catch {
            /* ignore */
        }
    };

    const sendTypingSignal = (typing) => {
        const contact = selectedContact.value;
        if (!contact?.conversationId || !isChatOpen(contact.conversationId)) return;

        axios.post(route('chat.conversations.typing', contact.conversationId), { typing }).catch(() => {});
    };

    const onComposerTyping = () => {
        sendTypingSignal(true);

        if (typingStopTimer) clearTimeout(typingStopTimer);
        typingStopTimer = setTimeout(() => {
            sendTypingSignal(false);
            typingStopTimer = null;
        }, 2000);
    };

    watch(echo.onlineUserIds, () => {
        const online = echo.onlineUserIds.value;
        contacts.value = contacts.value.map(c => ({
            ...c,
            online: online.has(c.userId),
        }));

        if (selectedContact.value) {
            selectedContact.value = {
                ...selectedContact.value,
                online: online.has(selectedContact.value.userId),
            };
        }
    }, { deep: true });

    const init = async () => {
        echo.init();
        await fetchConversations();
    };

    return {
        contacts,
        selectedContact,
        searchQuery,
        mobileView,
        messages,
        authAvatar,
        authName,
        loadingConversations,
        loadingMessages,
        loadingOlder,
        hasMoreMessages,
        sending,
        fetchConversations,
        loadOlderMessages,
        selectContact,
        startConversation,
        goBack,
        sendMessage,
        sendVoiceMessage,
        deleteMessage,
        canDeleteMessage,
        onComposerTyping,
        init,
    };
}
