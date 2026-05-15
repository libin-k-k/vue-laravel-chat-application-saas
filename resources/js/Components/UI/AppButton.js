import { defineComponent } from 'vue';

export default defineComponent({
    name: 'AppButton',

    inheritAttrs: false,

    props: {
        variant: {
            type: String,
            default: 'primary',
            validator: (v) => ['primary', 'secondary', 'danger', 'outline', 'ghost'].includes(v),
        },
        size: {
            type: String,
            default: 'md',
            validator: (v) => ['sm', 'md', 'lg'].includes(v),
        },
        loading: {
            type: Boolean,
            default: false,
        },
        block: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            default: 'button',
        },
    },
});
