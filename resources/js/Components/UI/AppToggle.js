import { defineComponent, computed } from 'vue';

export default defineComponent({
    name: 'AppToggle',

    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        id: {
            type: String,
            default: () => `toggle-${Math.random().toString(36).slice(2, 7)}`,
        },
    },

    emits: ['update:modelValue', 'change'],

    setup(props, { emit }) {
        const checked = computed({
            get: () => props.modelValue,
            set: (value) => {
                emit('update:modelValue', value);
                emit('change', value);
            },
        });

        return { checked };
    },
});
