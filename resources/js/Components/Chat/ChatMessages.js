import { defineComponent, ref, computed, watch, nextTick } from 'vue';
import ChatMessage from '@/Components/Chat/ChatMessage.vue';

export default defineComponent({
    name: 'ChatMessages',

    components: { ChatMessage },

    props: {
        messages: { type: Array, required: true },
        authUserId: { type: [Number, String], required: true },
        contact: { type: Object, required: true },
    },

    setup(props) {
        const listRef = ref(null);

        const scrollToBottom = (smooth = false) => {
            nextTick(() => {
                if (listRef.value) {
                    listRef.value.scrollTo({
                        top: listRef.value.scrollHeight,
                        behavior: smooth ? 'smooth' : 'auto',
                    });
                }
            });
        };

        watch(() => props.messages.length, () => scrollToBottom(true), { immediate: true });
        watch(() => props.contact?.id, () => scrollToBottom(false));

        const showAvatar = (messages, index) => {
            if (messages[index].senderId === props.authUserId) return false;
            if (index === messages.length - 1) return true;
            return messages[index + 1].senderId !== messages[index].senderId;
        };

        const groupedMessages = computed(() => {
            const groups = [];
            let current = null;
            for (const msg of props.messages) {
                if (!current || current.date !== msg.date) {
                    current = { date: msg.date, messages: [] };
                    groups.push(current);
                }
                current.messages.push(msg);
            }
            return groups;
        });

        return { listRef, showAvatar, groupedMessages };
    },
});
