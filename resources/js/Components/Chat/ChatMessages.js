import { defineComponent, ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import ChatMessage from '@/Components/Chat/ChatMessage.vue';

export default defineComponent({
    name: 'ChatMessages',

    components: { ChatMessage },

    props: {
        messages: { type: Array, required: true },
        authUserId: { type: [Number, String], required: true },
        authAvatar: { type: String, default: null },
        authName: { type: String, default: 'You' },
        contact: { type: Object, required: true },
        loading: { type: Boolean, default: false },
        loadingOlder: { type: Boolean, default: false },
        hasMore: { type: Boolean, default: false },
        canDeleteMessage: { type: Function, required: true },
    },

    emits: ['load-older', 'delete'],

    setup(props, { emit }) {
        const listRef = ref(null);
        const preserveScroll = ref(false);

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

        const onScroll = () => {
            const el = listRef.value;
            if (!el || props.loadingOlder || !props.hasMore) return;

            if (el.scrollTop < 80) {
                preserveScroll.value = true;
                const prevHeight = el.scrollHeight;
                emit('load-older');

                nextTick(() => {
                    requestAnimationFrame(() => {
                        if (listRef.value) {
                            listRef.value.scrollTop = listRef.value.scrollHeight - prevHeight;
                        }
                        preserveScroll.value = false;
                    });
                });
            }
        };

        watch(
            () => props.messages.length,
            (len, prev) => {
                if (preserveScroll.value) return;
                if (len > (prev ?? 0)) scrollToBottom(true);
            },
        );

        watch(
            () => props.contact?.conversationId,
            () => scrollToBottom(false),
        );

        watch(
            () => props.contact?.typing,
            (typing) => {
                if (typing) scrollToBottom(true);
            },
        );

        const isMineMessage = (msg) => {
            if (msg.senderId === 'me') return true;
            if (props.authUserId == null || props.authUserId === 'me') return false;

            return Number(msg.senderId) === Number(props.authUserId);
        };

        const showAvatar = (messages, index) => {
            const currentMine = isMineMessage(messages[index]);
            if (index === messages.length - 1) return true;
            const nextMine = isMineMessage(messages[index + 1]);
            return currentMine !== nextMine;
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

        onMounted(() => {
            listRef.value?.addEventListener('scroll', onScroll, { passive: true });
        });

        onUnmounted(() => {
            listRef.value?.removeEventListener('scroll', onScroll);
        });

        return { listRef, showAvatar, groupedMessages, isMineMessage };
    },
});
