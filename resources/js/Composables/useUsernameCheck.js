import { ref, watch } from 'vue';
import axios from 'axios';

let debounceTimer = null;

/**
 * @param {() => string} getUsername
 * @param {object} [options]
 * @param {() => string} [options.getOriginalUsername]
 * @param {() => number|null} [options.getExceptUserId]
 */
export function useUsernameCheck(getUsername, options = {}) {
    const usernameStatus = ref(null);
    const usernameMessage = ref('');
    const usernameSuggestions = ref([]);

    const getOriginal = () => (options.getOriginalUsername?.() ?? '').trim().toLowerCase();
    const getExceptId = () => options.getExceptUserId?.() ?? null;

    const isSubmitAllowed = () => {
        const username = getUsername().trim().toLowerCase();
        const original = getOriginal();

        if (!username) return false;
        if (original && username === original) return true;

        return usernameStatus.value === 'available' || usernameStatus.value === 'current';
    };

    watch(getUsername, (username) => {
        clearTimeout(debounceTimer);
        usernameSuggestions.value = [];

        const normalized = (username ?? '').trim().toLowerCase();
        const original = getOriginal();

        if (!normalized) {
            usernameStatus.value = null;
            usernameMessage.value = '';
            return;
        }

        if (original && normalized === original) {
            usernameStatus.value = 'current';
            usernameMessage.value = 'This is your current username.';
            return;
        }

        if (normalized.length < 3) {
            usernameStatus.value = 'invalid';
            usernameMessage.value = 'At least 3 characters required.';
            return;
        }

        if (!/^[a-z0-9_]+$/.test(normalized)) {
            usernameStatus.value = 'invalid';
            usernameMessage.value = 'Only lowercase letters, numbers and _ allowed.';
            return;
        }

        usernameStatus.value = 'checking';
        usernameMessage.value = '';

        debounceTimer = setTimeout(async () => {
            const requestedUsername = normalized;

            if (getUsername().trim().toLowerCase() !== requestedUsername) {
                return;
            }

            try {
                const params = { username: requestedUsername };
                const exceptId = getExceptId();
                if (exceptId) {
                    params.except = exceptId;
                }

                const { data } = await axios.get(route('username.check'), { params });

                if (getUsername().trim().toLowerCase() !== requestedUsername) {
                    return;
                }

                usernameStatus.value = data.status ?? (data.available ? 'available' : 'taken');
                usernameMessage.value = data.message;
                usernameSuggestions.value = data.suggestions || [];
            } catch {
                if (getUsername().trim().toLowerCase() !== requestedUsername) {
                    return;
                }
                usernameStatus.value = null;
                usernameMessage.value = '';
            }
        }, 420);
    }, { immediate: true });

    const applySuggestion = (suggestion, setUsername) => {
        setUsername(suggestion);
    };

    return {
        usernameStatus,
        usernameMessage,
        usernameSuggestions,
        isSubmitAllowed,
        applySuggestion,
    };
}
