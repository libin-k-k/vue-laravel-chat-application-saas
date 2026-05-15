import { defineComponent, computed } from 'vue';
import { useForm } from '@inertiajs/vue3';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import AppButton from '@/Components/UI/AppButton.vue';
import { Link } from '@inertiajs/vue3';

export default defineComponent({
    name: 'VerifyEmailResultPage',

    components: { GuestLayout, AppButton, Link },

    props: {
        success: {
            type: Boolean,
            required: true,
        },
        reason: {
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

        const resend = () => {
            form.post(route('verification.send'));
        };

        const title = computed(() => {
            if (props.reason === 'expired') {
                return 'Link expired';
            }
            return 'Invalid verification link';
        });

        const message = computed(() => {
            if (props.reason === 'expired') {
                return `This verification link has expired. Links are valid for ${props.expireMinutes} minutes only. Request a new one below.`;
            }
            return 'This link is invalid or has already been used. Request a new verification email if you still need to verify your account.';
        });

        return { form, resend, title, message };
    },
});
