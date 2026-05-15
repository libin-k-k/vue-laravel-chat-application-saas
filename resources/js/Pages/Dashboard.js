import { defineComponent, computed } from 'vue';
import { usePage, useForm } from '@inertiajs/vue3';

export default defineComponent({
    name: 'DashboardPage',

    setup() {
        const page = usePage();
        const user = computed(() => page.props.auth?.user);

        const logoutForm = useForm({});
        const logout = () => logoutForm.post(route('logout'));

        return { user, logout, logoutForm };
    },
});
