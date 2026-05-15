import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ChatHeader',

    props: {
        contact: { type: Object, required: true },
    },

    emits: ['back', 'search', 'info'],
});
