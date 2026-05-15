import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue';
import EmojiPicker from '@/Components/Chat/EmojiPicker.vue';
import AttachmentMenu from '@/Components/Chat/AttachmentMenu.vue';

export default defineComponent({
    name: 'ChatInput',

    components: { EmojiPicker, AttachmentMenu },

    props: {
        disabled: { type: Boolean, default: false },
    },

    emits: ['send', 'file-selected'],

    setup(props, { emit }) {
        const text = ref('');
        const hasText = computed(() => text.value.trim().length > 0);
        const inputRef = ref(null);

        /* Emoji picker */
        const showEmojiPicker = ref(false);
        const toggleEmojiPicker = () => {
            showEmojiPicker.value = !showEmojiPicker.value;
            showAttachmentMenu.value = false;
        };
        const onEmojiSelect = (emoji) => {
            text.value += emoji;
            inputRef.value?.focus();
        };

        /* Attachment menu */
        const showAttachmentMenu = ref(false);
        const toggleAttachmentMenu = () => {
            showAttachmentMenu.value = !showAttachmentMenu.value;
            showEmojiPicker.value = false;
        };
        const onFileSelected = (payload) => {
            emit('file-selected', payload);
            showAttachmentMenu.value = false;
        };

        /* Close both panels on outside click */
        const closeAll = () => {
            showEmojiPicker.value = false;
            showAttachmentMenu.value = false;
        };

        onMounted(() => document.addEventListener('click', closeAll));
        onUnmounted(() => document.removeEventListener('click', closeAll));

        /* Sending */
        const send = () => {
            if (!hasText.value || props.disabled) return;
            emit('send', text.value.trim());
            text.value = '';
            if (inputRef.value) inputRef.value.style.height = 'auto';
        };

        const onKeydown = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
            }
        };

        const autoResize = (e) => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
        };

        const focusInput = () => inputRef.value?.focus();

        return {
            text, hasText, inputRef,
            showEmojiPicker, toggleEmojiPicker, onEmojiSelect,
            showAttachmentMenu, toggleAttachmentMenu, onFileSelected,
            send, onKeydown, autoResize, focusInput,
        };
    },
});
