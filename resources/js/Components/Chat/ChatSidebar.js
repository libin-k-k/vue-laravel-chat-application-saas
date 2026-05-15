import { defineComponent, computed, ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import ChatContactItem from '@/Components/Chat/ChatContactItem.vue';
import ThemeToggle from '@/Components/UI/ThemeToggle.vue';
import LogoutConfirmModal from '@/Components/Chat/LogoutConfirmModal.vue';

export default defineComponent({
    name: 'ChatSidebar',

    components: { ChatContactItem, ThemeToggle, Link, LogoutConfirmModal },

    props: {
        contacts: { type: Array, required: true },
        selectedId: { type: [Number, String, null], default: null },
        authUser: { type: Object, required: true },
        searchQuery: { type: String, default: '' },
    },

    emits: ['select', 'update:searchQuery', 'logout', 'new-chat'],

    setup(props, { emit }) {
        const showLogoutModal = ref(false);

        const filteredContacts = computed(() => {
            if (!props.searchQuery) return props.contacts;
            const q = props.searchQuery.toLowerCase();
            return props.contacts.filter(c =>
                c.name.toLowerCase().includes(q) ||
                (c.lastMessage && c.lastMessage.toLowerCase().includes(q))
            );
        });

        const requestLogout = () => {
            showLogoutModal.value = true;
        };

        const confirmLogout = () => {
            showLogoutModal.value = false;
            emit('logout');
        };

        return {
            filteredContacts,
            showLogoutModal,
            requestLogout,
            confirmLogout,
        };
    },
});
