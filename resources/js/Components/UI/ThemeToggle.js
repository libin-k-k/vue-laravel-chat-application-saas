import { defineComponent } from 'vue';
import { useTheme } from '@/Composables/useTheme';

export default defineComponent({
    name: 'ThemeToggle',

    setup() {
        const { theme, toggleTheme } = useTheme();
        return { theme, toggleTheme };
    },
});
