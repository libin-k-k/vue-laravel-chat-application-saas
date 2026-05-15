import { defineComponent, computed } from 'vue';
import { usePage, Head } from '@inertiajs/vue3';
import ThemeToggle from '@/Components/UI/ThemeToggle.vue';
import { useTheme } from '@/Composables/useTheme';

export default defineComponent({
    name: 'GuestLayout',

    components: { ThemeToggle, Head },

    props: {
        title: {
            type: String,
            default: '',
        },
    },

    setup() {
        useTheme();
        const page = usePage();
        const appName = computed(() => page.props.appName ?? 'ChatApp');
        const year = new Date().getFullYear();
        return { appName, year };
    },
});
