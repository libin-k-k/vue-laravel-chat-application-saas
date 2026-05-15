import { defineComponent, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import AppButton from '@/Components/UI/AppButton.vue';

const OUTPUT_SIZE = 512;

export default defineComponent({
    name: 'ProfilePhotoCropper',

    components: { AppButton },

    props: {
        imageSrc: {
            type: String,
            required: true,
        },
    },

    emits: ['confirm', 'cancel'],

    setup(props, { emit }) {
        const imageRef = ref(null);
        const cropper = ref(null);
        const processing = ref(false);

        const initCropper = () => {
            if (!imageRef.value) return;

            cropper.value?.destroy();
            cropper.value = new Cropper(imageRef.value, {
                aspectRatio: 1,
                viewMode: 1,
                dragMode: 'move',
                autoCropArea: 1,
                responsive: true,
                restore: false,
                guides: true,
                center: true,
                highlight: true,
                cropBoxMovable: true,
                cropBoxResizable: true,
                toggleDragModeOnDblclick: false,
            });
        };

        onMounted(() => {
            const img = imageRef.value;
            if (!img) return;

            if (img.complete) {
                initCropper();
            } else {
                img.addEventListener('load', initCropper, { once: true });
            }
        });

        watch(() => props.imageSrc, () => {
            if (cropper.value) {
                cropper.value.replace(props.imageSrc);
            }
        });

        onBeforeUnmount(() => {
            cropper.value?.destroy();
        });

        const confirm = () => {
            if (!cropper.value || processing.value) return;

            processing.value = true;

            const canvas = cropper.value.getCroppedCanvas({
                width: OUTPUT_SIZE,
                height: OUTPUT_SIZE,
                imageSmoothingEnabled: true,
                imageSmoothingQuality: 'high',
            });

            canvas.toBlob(
                (blob) => {
                    processing.value = false;
                    if (!blob) {
                        return;
                    }
                    const file = new File([blob], 'profile.jpg', {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    });
                    emit('confirm', file);
                },
                'image/jpeg',
                0.92,
            );
        };

        const cancel = () => emit('cancel');

        return {
            imageRef,
            processing,
            confirm,
            cancel,
        };
    },
});
