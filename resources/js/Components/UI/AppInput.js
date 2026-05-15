import { defineComponent } from 'vue';

export default defineComponent({
    name: 'AppInput',

    inheritAttrs: false,

    props: {
        modelValue: {
            type: [String, Number],
            default: '',
        },
        label: {
            type: String,
            default: '',
        },
        error: {
            type: String,
            default: '',
        },
        hint: {
            type: String,
            default: '',
        },
        id: {
            type: String,
            default: () => `input-${Math.random().toString(36).slice(2, 7)}`,
        },
    },

    emits: ['update:modelValue'],
});
