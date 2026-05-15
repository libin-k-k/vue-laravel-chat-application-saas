import { defineComponent, ref, watch } from 'vue';
import { useForm } from '@inertiajs/vue3';
import axios from 'axios';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import AppButton from '@/Components/UI/AppButton.vue';
import AppInput from '@/Components/UI/AppInput.vue';
import { Link } from '@inertiajs/vue3';

/* ------------------------------------------------------------------
   Username helpers
------------------------------------------------------------------ */
function toUsername(name) {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s_]/g, '')
        .replace(/\s+/g, '_')
        .replace(/_{2,}/g, '_')
        .replace(/^_+|_+$/g, '')
        .substring(0, 30);
}

let debounceTimer = null;

/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------ */
export default defineComponent({
    name: 'RegisterPage',

    components: { GuestLayout, AppButton, AppInput, Link },

    setup() {
        const form = useForm({
            name: '',
            username: '',
            email: '',
            mobile: '',
            password: '',
            password_confirmation: '',
        });

        /** null | 'checking' | 'available' | 'taken' | 'invalid' */
        const usernameStatus = ref(null);
        const usernameMessage = ref('');
        const usernameSuggestions = ref([]);

        /* Track whether the user has manually edited the username field */
        let userEditedUsername = false;

        /* Auto-generate username when name changes (only if not manually edited) */
        watch(() => form.name, (name) => {
            if (!userEditedUsername && name) {
                form.username = toUsername(name);
            }
        });

        /* Debounced availability check whenever username changes */
        watch(() => form.username, (username) => {
            clearTimeout(debounceTimer);
            usernameSuggestions.value = [];

            if (!username) {
                usernameStatus.value = null;
                usernameMessage.value = '';
                return;
            }

            if (username.length < 3) {
                usernameStatus.value = 'invalid';
                usernameMessage.value = 'At least 3 characters required.';
                return;
            }

            if (!/^[a-z0-9_]+$/.test(username)) {
                usernameStatus.value = 'invalid';
                usernameMessage.value = 'Only lowercase letters, numbers and _ allowed.';
                return;
            }

            usernameStatus.value = 'checking';
            usernameMessage.value = '';

            debounceTimer = setTimeout(async () => {
                // Capture the value that triggered this request.
                // If the field was cleared or changed while the request was
                // in-flight, discard the stale response entirely.
                const requestedUsername = username;

                try {
                    const { data } = await axios.get(route('username.check'), { params: { username: requestedUsername } });

                    if (form.username !== requestedUsername) return;

                    usernameStatus.value = data.available ? 'available' : 'taken';
                    usernameMessage.value = data.message;
                    usernameSuggestions.value = data.suggestions || [];
                } catch {
                    if (form.username !== requestedUsername) return;
                    usernameStatus.value = null;
                    usernameMessage.value = '';
                }
            }, 420);
        });

        /* Mark username as user-edited when they focus then type */
        const onUsernameInput = () => {
            userEditedUsername = true;
        };

        /* Apply a suggestion chip */
        const applySuggestion = (suggestion) => {
            userEditedUsername = true;
            form.username = suggestion;
        };

        const submit = () => {
            form.post(route('register'), {
                onFinish: () => form.reset('password', 'password_confirmation'),
            });
        };

        return {
            form,
            submit,
            usernameStatus,
            usernameMessage,
            usernameSuggestions,
            onUsernameInput,
            applySuggestion,
        };
    },
});
