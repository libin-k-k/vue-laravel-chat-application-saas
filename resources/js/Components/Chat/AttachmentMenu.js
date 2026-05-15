import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'AttachmentMenu',

    emits: ['file-selected', 'close'],

    setup(props, { emit }) {
        const imageInput = ref(null);
        const videoInput = ref(null);
        const documentInput = ref(null);

        const openImages = () => imageInput.value?.click();
        const openVideos = () => videoInput.value?.click();
        const openDocuments = () => documentInput.value?.click();

        const onFileChange = (e, type) => {
            const files = Array.from(e.target.files || []);
            if (files.length) {
                emit('file-selected', { files, type });
            }
            e.target.value = '';
            emit('close');
        };

        return { imageInput, videoInput, documentInput, openImages, openVideos, openDocuments, onFileChange };
    },
});
