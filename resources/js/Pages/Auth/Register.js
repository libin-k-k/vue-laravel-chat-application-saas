import { defineComponent } from 'vue';
import { useForm } from '@inertiajs/vue3';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import AppButton from '@/Components/UI/AppButton.vue';
import AppInput from '@/Components/UI/AppInput.vue';
import { Link } from '@inertiajs/vue3';

export default defineComponent({
    name: 'RegisterPage',

    components: { GuestLayout, AppButton, AppInput, Link },

    setup() {
        const form = useForm({
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
        });

        const submit = () => {
            form.post(route('register'), {
                onFinish: () => form.reset('password', 'password_confirmation'),
            });
        };

        return { form, submit };
    },
});
