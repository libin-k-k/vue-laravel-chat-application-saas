import { ref } from 'vue';

const theme = ref(
    typeof window !== 'undefined'
        ? (localStorage.getItem('chat-theme') ||
           (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
        : 'light'
);

export function useTheme() {
    const toggleTheme = () => {
        theme.value = theme.value === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme.value);
        localStorage.setItem('chat-theme', theme.value);
    };

    const setTheme = (value) => {
        theme.value = value;
        document.documentElement.setAttribute('data-theme', value);
        localStorage.setItem('chat-theme', value);
    };

    return { theme, toggleTheme, setTheme };
}
