import { defineComponent, computed } from 'vue';
import ChatContactItem from '@/Components/Chat/ChatContactItem.vue';
import ThemeToggle from '@/Components/UI/ThemeToggle.vue';

export default defineComponent({
    name: 'ChatSidebar',

    components: { ChatContactItem, ThemeToggle },

    props: {
        contacts: { type: Array, required: true },
        selectedId: { type: [Number, String, null], default: null },
        authUser: { type: Object, required: true },
        searchQuery: { type: String, default: '' },
    },

    emits: ['select', 'update:searchQuery', 'logout'],

    setup(props) {
        const filteredContacts = computed(() => {
            if (!props.searchQuery) return props.contacts;
            const q = props.searchQuery.toLowerCase();
            return props.contacts.filter(c =>
                c.name.toLowerCase().includes(q) ||
                (c.lastMessage && c.lastMessage.toLowerCase().includes(q))
            );
        });

        return { filteredContacts };
    },
});
