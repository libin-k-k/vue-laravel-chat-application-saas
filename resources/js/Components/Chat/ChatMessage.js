import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ChatMessage',

    props: {
        message: { type: Object, required: true },
        isMine: { type: Boolean, default: false },
        showAvatar: { type: Boolean, default: true },
        contactName: { type: String, default: '' },
    },
});
