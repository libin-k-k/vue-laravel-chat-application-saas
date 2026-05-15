import { ref, computed } from 'vue';

/* ------------------------------------------------------------------
   Mock data — replace with real API / WebSocket calls
------------------------------------------------------------------ */
const contacts = ref([
    {
        id: 1,
        name: 'Alice Johnson',
        avatar: null,
        online: true,
        lastMessage: 'Can we meet tomorrow?',
        lastTime: '10:42 AM',
        unread: 3,
        isMine: false,
        muted: false,
        typing: false,
        lastSeen: null,
    },
    {
        id: 2,
        name: 'Bob Martinez',
        avatar: null,
        online: false,
        lastMessage: 'I sent you the files ✓✓',
        lastTime: 'Yesterday',
        unread: 0,
        isMine: true,
        muted: false,
        typing: false,
        lastSeen: 'yesterday at 6:30 PM',
    },
    {
        id: 3,
        name: 'Dev Team',
        avatar: null,
        online: false,
        lastMessage: 'New deploy is live 🚀',
        lastTime: 'Mon',
        unread: 12,
        isMine: false,
        muted: true,
        typing: false,
        lastSeen: null,
    },
    {
        id: 4,
        name: 'Sarah Chen',
        avatar: null,
        online: true,
        lastMessage: 'Thanks! Talk later.',
        lastTime: '9:15 AM',
        unread: 0,
        isMine: false,
        muted: false,
        typing: true,
        lastSeen: null,
    },
    {
        id: 5,
        name: 'Michael Scott',
        avatar: null,
        online: false,
        lastMessage: "That's what she said 😄",
        lastTime: 'Sun',
        unread: 0,
        isMine: false,
        muted: false,
        typing: false,
        lastSeen: '2 days ago',
    },
]);

const messageStore = ref({
    1: [
        { id: 1, senderId: 1, text: 'Hey! How are you?', time: '10:30 AM', date: 'Today', status: 'read' },
        { id: 2, senderId: 'me', text: "I'm good, thanks! What's up?", time: '10:31 AM', date: 'Today', status: 'read' },
        { id: 3, senderId: 1, text: 'Can we meet tomorrow?', time: '10:42 AM', date: 'Today', status: 'read' },
    ],
    2: [
        { id: 1, senderId: 'me', text: 'Here are the files you needed.', time: '5:00 PM', date: 'Yesterday', status: 'read' },
        { id: 2, senderId: 2, text: 'Got it, thank you!', time: '5:10 PM', date: 'Yesterday', status: 'read' },
        { id: 3, senderId: 'me', text: 'I sent you the files ✓✓', time: '6:15 PM', date: 'Yesterday', status: 'delivered' },
    ],
    3: [
        { id: 1, senderId: 3, text: 'Sprint review at 3pm today.', time: '9:00 AM', date: 'Monday', status: null },
        { id: 2, senderId: 1, text: 'On it!', time: '9:02 AM', date: 'Monday', status: null },
        { id: 3, senderId: 3, text: 'New deploy is live 🚀', time: '11:45 AM', date: 'Monday', status: null },
    ],
    4: [
        { id: 1, senderId: 4, text: 'Did you review my PR?', time: '8:50 AM', date: 'Today', status: null },
        { id: 2, senderId: 'me', text: 'Yes, left some comments. Looks great overall!', time: '9:10 AM', date: 'Today', status: 'read' },
        { id: 3, senderId: 4, text: 'Thanks! Talk later.', time: '9:15 AM', date: 'Today', status: null },
    ],
    5: [
        { id: 1, senderId: 5, text: 'Did I stutter?', time: '3:00 PM', date: 'Sunday', status: null },
        { id: 2, senderId: 'me', text: 'Haha 😂', time: '3:05 PM', date: 'Sunday', status: 'read' },
        { id: 3, senderId: 5, text: "That's what she said 😄", time: '3:06 PM', date: 'Sunday', status: null },
    ],
});

export function useChat() {
    const selectedContact = ref(null);
    const searchQuery = ref('');
    const sidebarOpen = ref(true);

    const messages = computed(() =>
        selectedContact.value ? (messageStore.value[selectedContact.value.id] || []) : []
    );

    const filteredContacts = computed(() => {
        if (!searchQuery.value) return contacts.value;
        const q = searchQuery.value.toLowerCase();
        return contacts.value.filter(c =>
            c.name.toLowerCase().includes(q) ||
            (c.lastMessage && c.lastMessage.toLowerCase().includes(q))
        );
    });

    const selectContact = (contact) => {
        selectedContact.value = contact;
        const c = contacts.value.find(x => x.id === contact.id);
        if (c) c.unread = 0;
        sidebarOpen.value = false;
    };

    const goBack = () => {
        sidebarOpen.value = true;
        selectedContact.value = null;
    };

    const startConversation = (user) => {
        let contact = contacts.value.find(c => c.id === user.id);
        if (!contact) {
            contact = {
                id: user.id,
                name: user.name,
                avatar: user.profile_photo_url ?? null,
                online: false,
                lastMessage: null,
                lastTime: null,
                unread: 0,
                isMine: false,
                muted: false,
                typing: false,
                lastSeen: null,
            };
            contacts.value.unshift(contact);
            messageStore.value[user.id] = [];
        }
        selectContact(contact);
    };

    const sendMessage = (text) => {
        if (!selectedContact.value) return;
        const id = selectedContact.value.id;
        const newMsg = {
            id: Date.now(),
            senderId: 'me',
            text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: 'Today',
            status: 'sent',
        };
        if (!messageStore.value[id]) messageStore.value[id] = [];
        messageStore.value[id].push(newMsg);

        const c = contacts.value.find(x => x.id === id);
        if (c) {
            c.lastMessage = text;
            c.lastTime = newMsg.time;
            c.isMine = true;
        }
    };

    return {
        contacts,
        selectedContact,
        searchQuery,
        sidebarOpen,
        messages,
        filteredContacts,
        selectContact,
        startConversation,
        goBack,
        sendMessage,
    };
}
