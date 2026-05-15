import { defineComponent, computed, ref } from 'vue';
import { usePage, useForm } from '@inertiajs/vue3';
import { useChat } from '@/Composables/useChat';
import ChatSidebar from '@/Components/Chat/ChatSidebar.vue';
import ChatHeader from '@/Components/Chat/ChatHeader.vue';
import ChatMessages from '@/Components/Chat/ChatMessages.vue';
import ChatInput from '@/Components/Chat/ChatInput.vue';
import ChatEmptyState from '@/Components/Chat/ChatEmptyState.vue';
import ChatFab from '@/Components/Chat/ChatFab.vue';
import NewChatModal from '@/Components/Chat/NewChatModal.vue';
import { useTheme } from '@/Composables/useTheme';

export default defineComponent({
    name: 'ChatIndex',

    components: {
        ChatSidebar,
        ChatHeader,
        ChatMessages,
        ChatInput,
        ChatEmptyState,
        ChatFab,
        NewChatModal,
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
            startConversation,
            goBack,
            sendMessage,
        } = useChat();

        const showNewChatModal = ref(false);

        const logoutForm = useForm({});
        const logout = () => logoutForm.post(route('logout'));

        const onNewChat = () => {
            showNewChatModal.value = true;
        };

        const onSelectUser = (user) => {
            startConversation(user);
            showNewChatModal.value = false;
        };

        const closeNewChatModal = () => {
            showNewChatModal.value = false;
        };

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
            showNewChatModal,
            onNewChat,
            onSelectUser,
            closeNewChatModal,
        };
    },
});
