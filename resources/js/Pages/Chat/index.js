import { defineComponent, computed } from 'vue';
import { usePage, useForm } from '@inertiajs/vue3';
import { useChat } from '@/Composables/useChat';
import ChatSidebar from '@/Components/Chat/ChatSidebar.vue';
import ChatHeader from '@/Components/Chat/ChatHeader.vue';
import ChatMessages from '@/Components/Chat/ChatMessages.vue';
import ChatInput from '@/Components/Chat/ChatInput.vue';
import ChatEmptyState from '@/Components/Chat/ChatEmptyState.vue';
import { useTheme } from '@/Composables/useTheme';

export default defineComponent({
    name: 'ChatIndex',

    components: {
        ChatSidebar,
        ChatHeader,
        ChatMessages,
        ChatInput,
        ChatEmptyState,
    },

    setup() {
        useTheme();

        const page = usePage();
        const authUser = computed(() => page.props.auth?.user);
        const authId = computed(() => authUser.value?.id ?? 'me');

        const {
            contacts,
            selectedContact,
            searchQuery,
            sidebarOpen,
            messages,
            selectContact,
            goBack,
            sendMessage,
        } = useChat();

        const logoutForm = useForm({});
        const logout = () => logoutForm.post(route('logout'));

        return {
            authUser,
            authId,
            contacts,
            selectedContact,
            searchQuery,
            sidebarOpen,
            messages,
            selectContact,
            goBack,
            sendMessage,
            logout,
        };
    },
});
