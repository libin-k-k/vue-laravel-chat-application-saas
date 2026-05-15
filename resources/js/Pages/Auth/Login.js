import { defineComponent } from 'vue';
import { useForm } from '@inertiajs/vue3';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import AppButton from '@/Components/UI/AppButton.vue';
import AppInput from '@/Components/UI/AppInput.vue';
import { Link } from '@inertiajs/vue3';

export default defineComponent({
    name: 'LoginPage',

    components: { GuestLayout, AppButton, AppInput, Link },

    props: {
        canResetPassword: { type: Boolean, default: false },
        status: { type: String, default: null },
    },

    setup() {
        const form = useForm({
            login: '',
            password: '',
            remember: false,
        });

        const submit = () => {
            form.post(route('login'), {
                onFinish: () => form.reset('password'),
            });
        };

        return { form, submit };
    },
});
