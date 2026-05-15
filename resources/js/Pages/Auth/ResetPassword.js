import { defineComponent } from 'vue';
import { useForm, Link } from '@inertiajs/vue3';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import AppButton from '@/Components/UI/AppButton.vue';
import AppInput from '@/Components/UI/AppInput.vue';

export default defineComponent({
    name: 'ResetPasswordPage',

    components: { GuestLayout, AppButton, AppInput, Link },

    props: {
        email: { type: String, required: true },
        token: { type: String, required: true },
    },

    setup(props) {
        const form = useForm({
            token: props.token,
            email: props.email,
            password: '',
            password_confirmation: '',
        });

        const submit = () => {
            form.post(route('password.store'), {
                onFinish: () => form.reset('password', 'password_confirmation'),
            });
        };

        return { form, submit };
    },
});
