import { defineComponent } from 'vue';
import { useForm, Link } from '@inertiajs/vue3';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import AppButton from '@/Components/UI/AppButton.vue';
import AppInput from '@/Components/UI/AppInput.vue';

export default defineComponent({
    name: 'ForgotPasswordPage',

    components: { GuestLayout, AppButton, AppInput, Link },

    props: {
        status: { type: String, default: null },
    },

    setup() {
        const form = useForm({
            email: '',
        });

        const submit = () => {
            form.post(route('password.email'));
        };

        return { form, submit };
    },
});
