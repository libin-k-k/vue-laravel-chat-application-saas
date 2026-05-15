import { defineComponent, onMounted, onUnmounted, ref, nextTick } from 'vue';
import { useUserSearch } from '@/Composables/useUserSearch';

export default defineComponent({
    name: 'NewChatModal',

    emits: ['close', 'select'],

    setup(props, { emit }) {
        const inputRef = ref(null);
        const { query, results, loading, searched, error, reset } = useUserSearch();

        onMounted(() => {
            nextTick(() => inputRef.value?.focus());
        });

        onUnmounted(() => {
            reset();
        });

        const close = () => emit('close');

        const selectUser = (user) => emit('select', user);

        return {
            inputRef,
            query,
            results,
            loading,
            searched,
            error,
            close,
            selectUser,
        };
    },
});
