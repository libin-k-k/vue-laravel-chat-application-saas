import { defineComponent, ref, computed } from 'vue';
import VoiceMessagePlayer from '@/Components/Chat/VoiceMessagePlayer.vue';

export default defineComponent({
    name: 'ChatMessage',

    components: { VoiceMessagePlayer },

    props: {
        message: { type: Object, required: true },
        isMine: { type: Boolean, default: false },
        showAvatar: { type: Boolean, default: true },
        contactName: { type: String, default: '' },
        contactAvatar: { type: String, default: null },
        myAvatar: { type: String, default: null },
        myName: { type: String, default: 'You' },
        canDelete: { type: Boolean, default: false },
    },

    emits: ['delete'],

    setup(props, { emit }) {
        const menuOpen = ref(false);
        const menuPos = ref({ x: 0, y: 0 });

        const avatarUrl = computed(() => (props.isMine ? props.myAvatar : props.contactAvatar));
        const avatarLabel = computed(() => (props.isMine ? props.myName : props.contactName));

        const closeMenu = () => {
            menuOpen.value = false;
        };

        const openMenu = (x, y) => {
            if (!props.canDelete || props.message.isDeleted) return;
            menuPos.value = { x, y };
            menuOpen.value = true;
        };

        const onContextMenu = (e) => {
            e.preventDefault();
            openMenu(e.clientX, e.clientY);
        };

        let longPressTimer = null;

        const onTouchStart = (e) => {
            if (!props.canDelete || props.message.isDeleted) return;
            const touch = e.touches[0];
            longPressTimer = setTimeout(() => {
                openMenu(touch.clientX, touch.clientY);
            }, 500);
        };

        const onTouchEnd = () => {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
        };

        const onDelete = () => {
            closeMenu();
            emit('delete', props.message.id);
        };

        const onDocumentClick = () => closeMenu();

        return {
            menuOpen,
            menuPos,
            avatarUrl,
            avatarLabel,
            onContextMenu,
            onTouchStart,
            onTouchEnd,
            onDelete,
            onDocumentClick,
            closeMenu,
        };
    },

    mounted() {
        document.addEventListener('click', this.onDocumentClick);
    },

    unmounted() {
        document.removeEventListener('click', this.onDocumentClick);
    },
});
