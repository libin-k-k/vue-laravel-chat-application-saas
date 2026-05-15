import { defineComponent } from 'vue';
import { useForm } from '@inertiajs/vue3';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import AppButton from '@/Components/UI/AppButton.vue';

export default defineComponent({
    name: 'VerifyEmailPage',

    components: { GuestLayout, AppButton },

    props: {
        status: {
            type: String,
            default: null,
        },
        expireMinutes: {
            type: Number,
            default: 2,
        },
    },

    setup(props) {
        const form = useForm({});
        const logoutForm = useForm({});

        const resend = () => {
            form.post(route('verification.send'));
        };

        const logout = () => {
            logoutForm.post(route('logout'));
        };

        const statusMessage = () => {
            if (props.status === 'verification-link-sent') {
                return 'A new verification link has been sent to your email address.';
            }
            return null;
        };

        return { form, logoutForm, resend, logout, statusMessage };
    },
});
