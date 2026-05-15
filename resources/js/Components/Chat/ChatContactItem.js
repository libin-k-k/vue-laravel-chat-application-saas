import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ChatContactItem',

    props: {
        contact: { type: Object, required: true },
        active: { type: Boolean, default: false },
    },
});
