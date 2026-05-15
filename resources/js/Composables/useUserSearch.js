import { ref, watch } from 'vue';
import axios from 'axios';

export function useUserSearch() {
    const query = ref('');
    const results = ref([]);
    const loading = ref(false);
    const searched = ref(false);
    const error = ref(null);

    let debounceTimer = null;
    let abortController = null;

    const search = async (q) => {
        if (abortController) {
            abortController.abort();
        }

        if (q.length < 2) {
            results.value = [];
            loading.value = false;
            searched.value = false;
            error.value = null;
            return;
        }

        abortController = new AbortController();
        loading.value = true;
        error.value = null;

        try {
            const { data } = await axios.get(route('users.search'), {
                params: { q },
                signal: abortController.signal,
            });
            results.value = data.users ?? [];
            searched.value = true;
        } catch (err) {
            if (err.code === 'ERR_CANCELED' || err.name === 'CanceledError') {
                return;
            }
            results.value = [];
            searched.value = true;
            error.value = 'Could not search users. Please try again.';
        } finally {
            loading.value = false;
        }
    };

    watch(query, (value) => {
        clearTimeout(debounceTimer);
        const trimmed = value.trim();

        if (trimmed.length < 2) {
            results.value = [];
            loading.value = false;
            searched.value = false;
            error.value = null;
            return;
        }

        debounceTimer = setTimeout(() => search(trimmed), 300);
    });

    const reset = () => {
        clearTimeout(debounceTimer);
        if (abortController) {
            abortController.abort();
        }
        query.value = '';
        results.value = [];
        loading.value = false;
        searched.value = false;
        error.value = null;
    };

    return {
        query,
        results,
        loading,
        searched,
        error,
        reset,
    };
}
