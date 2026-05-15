import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue';
import EmojiPicker from '@/Components/Chat/EmojiPicker.vue';
import AttachmentMenu from '@/Components/Chat/AttachmentMenu.vue';
import VoiceRecorderPanel from '@/Components/Chat/VoiceRecorderPanel.vue';
import { useVoiceRecorder } from '@/Composables/useVoiceRecorder';

export default defineComponent({
    name: 'ChatInput',

    components: { EmojiPicker, AttachmentMenu, VoiceRecorderPanel },

    props: {
        disabled: { type: Boolean, default: false },
    },

    emits: ['send', 'send-voice', 'file-selected', 'typing'],

    setup(props, { emit }) {
        const text = ref('');
        const hasText = computed(() => text.value.trim().length > 0);
        const inputRef = ref(null);
        const micHeld = ref(false);

        const {
            isRecording,
            hasPreview,
            previewUrl,
            previewBlob,
            previewDuration,
            formattedDuration,
            error: voiceError,
            isSupported: micSupported,
            permissionState: micPermissionState,
            ensureMicrophoneReady,
            refreshPermission,
            startRecording,
            stopRecording,
            discardPreview,
            reset: resetVoice,
        } = useVoiceRecorder();

        const voiceMode = computed(() => isRecording.value || hasPreview.value);

        /* Emoji picker */
        const showEmojiPicker = ref(false);
        const toggleEmojiPicker = () => {
            if (voiceMode.value) return;
            showEmojiPicker.value = !showEmojiPicker.value;
            showAttachmentMenu.value = false;
        };
        const onEmojiSelect = (emoji) => {
            text.value += emoji;
            inputRef.value?.focus();
        };

        /* Attachment menu */
        const showAttachmentMenu = ref(false);
        const toggleAttachmentMenu = () => {
            if (voiceMode.value) return;
            showAttachmentMenu.value = !showAttachmentMenu.value;
            showEmojiPicker.value = false;
        };
        const onFileSelected = (payload) => {
            emit('file-selected', payload);
            showAttachmentMenu.value = false;
        };

        const closeAll = () => {
            if (!voiceMode.value) {
                showEmojiPicker.value = false;
                showAttachmentMenu.value = false;
            }
        };

        onMounted(() => {
            document.addEventListener('click', closeAll);
            refreshPermission();
        });
        onUnmounted(() => {
            document.removeEventListener('click', closeAll);
            document.removeEventListener('pointerup', onGlobalPointerUp);
            document.removeEventListener('pointercancel', onGlobalPointerUp);
            resetVoice();
        });

        /* Text send */
        const send = () => {
            if (!hasText.value || props.disabled) return;
            emit('send', text.value.trim());
            text.value = '';
            if (inputRef.value) inputRef.value.style.height = 'auto';
        };

        const onKeydown = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
            }
        };

        const autoResize = (e) => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
        };

        const onInput = () => {
            if (text.value.trim()) {
                emit('typing');
            }
        };

        /* Voice — hold mic to record */
        const canRecord = computed(() => !hasText.value && !props.disabled && !hasPreview.value);

        const onGlobalPointerUp = () => {
            if (!micHeld.value) return;
            micHeld.value = false;
            if (isRecording.value) {
                stopRecording();
            }
        };

        const bindGlobalPointerRelease = () => {
            document.addEventListener('pointerup', onGlobalPointerUp);
            document.addEventListener('pointercancel', onGlobalPointerUp);
        };

        const unbindGlobalPointerRelease = () => {
            document.removeEventListener('pointerup', onGlobalPointerUp);
            document.removeEventListener('pointercancel', onGlobalPointerUp);
        };

        const onMicPointerDown = async (e) => {
            if (!canRecord.value || !micSupported) return;
            e.preventDefault();
            micHeld.value = true;
            closeAll();
            bindGlobalPointerRelease();

            const permitted = await ensureMicrophoneReady();
            if (!permitted) {
                micHeld.value = false;
                unbindGlobalPointerRelease();
                return;
            }

            const started = await startRecording();
            if (!started) {
                micHeld.value = false;
                unbindGlobalPointerRelease();
            }
        };

        const onMicPointerUp = (e) => {
            e.preventDefault();
            micHeld.value = false;
            unbindGlobalPointerRelease();
            if (isRecording.value) {
                stopRecording();
            }
        };

        const onDiscardVoice = () => {
            discardPreview();
        };

        const onSendVoice = () => {
            if (!previewBlob.value) return;
            const sendUrl = URL.createObjectURL(previewBlob.value);
            emit('send-voice', {
                blob: previewBlob.value,
                url: sendUrl,
                duration: previewDuration.value,
                mimeType: previewBlob.value.type,
            });
            discardPreview();
        };

        const onMicClick = (e) => {
            if (hasText.value) {
                send();
            }
        };

        return {
            text,
            hasText,
            inputRef,
            showEmojiPicker,
            toggleEmojiPicker,
            onEmojiSelect,
            showAttachmentMenu,
            toggleAttachmentMenu,
            onFileSelected,
            send,
            onKeydown,
            autoResize,
            onInput,
            isRecording,
            hasPreview,
            previewUrl,
            voiceMode,
            voiceError,
            formattedDuration,
            previewDuration,
            micSupported,
            micPermissionState,
            canRecord,
            onMicPointerDown,
            onMicPointerUp,
            onMicClick,
            onDiscardVoice,
            onSendVoice,
        };
    },
});
