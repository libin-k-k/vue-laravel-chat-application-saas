import { ref, computed, onUnmounted } from 'vue';
import {
    checkMicrophoneSupport,
    queryMicrophonePermission,
    requestMicrophoneStream,
    getAudioBlobDuration,
    formatAudioTime,
} from '@/Composables/useMicrophone';

const MAX_DURATION_SEC = 300;
const MIN_DURATION_SEC = 0.5;

function pickMimeType() {
    const types = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
    ];
    return types.find(t => MediaRecorder.isTypeSupported(t)) ?? '';
}

export function useVoiceRecorder() {
    const isRecording = ref(false);
    const durationSec = ref(0);
    const previewBlob = ref(null);
    const previewUrl = ref(null);
    const previewDuration = ref(0);
    const error = ref(null);
    const isSupported = ref(false);
    const permissionState = ref('unknown');

    let mediaRecorder = null;
    let mediaStream = null;
    let chunks = [];
    let timerId = null;
    let startedAt = 0;

    const hasPreview = computed(() => previewUrl.value !== null);
    const formattedDuration = computed(() => formatAudioTime(durationSec.value));
    const formattedPreviewDuration = computed(() => formatAudioTime(previewDuration.value));

    const refreshSupport = () => {
        const result = checkMicrophoneSupport();
        isSupported.value = result.supported;
        if (!result.supported) {
            error.value = result.message;
        }
        return result.supported;
    };

    const refreshPermission = async () => {
        permissionState.value = await queryMicrophonePermission();
        return permissionState.value;
    };

    refreshSupport();

    const cleanupStream = () => {
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            mediaStream = null;
        }
    };

    const revokePreview = () => {
        if (previewUrl.value) {
            URL.revokeObjectURL(previewUrl.value);
        }
        previewBlob.value = null;
        previewUrl.value = null;
        previewDuration.value = 0;
    };

    const clearTimer = () => {
        if (timerId !== null) {
            clearInterval(timerId);
            timerId = null;
        }
    };

    /**
     * Check support + request browser microphone permission.
     * @returns {Promise<boolean>}
     */
    const ensureMicrophoneReady = async () => {
        error.value = null;

        if (!refreshSupport()) {
            return false;
        }

        await refreshPermission();

        if (permissionState.value === 'denied') {
            error.value = 'Microphone is blocked. Enable it in your browser address bar or site settings.';
            return false;
        }

        try {
            cleanupStream();
            mediaStream = await requestMicrophoneStream();
            permissionState.value = 'granted';
            return true;
        } catch (err) {
            permissionState.value = 'denied';
            error.value = err.message || 'Microphone permission was denied.';
            cleanupStream();
            return false;
        }
    };

    const startRecording = async () => {
        if (isRecording.value || hasPreview.value) return false;

        error.value = null;

        if (!mediaStream) {
            const ready = await ensureMicrophoneReady();
            if (!ready) return false;
        }

        try {
            const mimeType = pickMimeType();
            mediaRecorder = mimeType
                ? new MediaRecorder(mediaStream, { mimeType })
                : new MediaRecorder(mediaStream);

            chunks = [];
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            mediaRecorder.start(200);
            isRecording.value = true;
            durationSec.value = 0;
            startedAt = Date.now();

            timerId = setInterval(() => {
                durationSec.value = (Date.now() - startedAt) / 1000;
                if (durationSec.value >= MAX_DURATION_SEC) {
                    stopRecording();
                }
            }, 100);

            return true;
        } catch (err) {
            error.value = err.message || 'Could not start recording.';
            cleanupStream();
            return false;
        }
    };

    const stopRecording = () => {
        if (!isRecording.value || !mediaRecorder) return Promise.resolve(null);

        clearTimer();
        isRecording.value = false;

        const recordedDuration = (Date.now() - startedAt) / 1000;

        return new Promise((resolve) => {
            mediaRecorder.onstop = async () => {
                cleanupStream();

                if (recordedDuration < MIN_DURATION_SEC || chunks.length === 0) {
                    chunks = [];
                    durationSec.value = 0;
                    resolve(null);
                    return;
                }

                const mimeType = mediaRecorder.mimeType || 'audio/webm';
                const blob = new Blob(chunks, { type: mimeType });
                chunks = [];

                const audioDuration = await getAudioBlobDuration(blob);
                const finalDuration = audioDuration > 0 ? audioDuration : recordedDuration;

                revokePreview();
                previewBlob.value = blob;
                previewUrl.value = URL.createObjectURL(blob);
                previewDuration.value = finalDuration;
                durationSec.value = 0;

                resolve({
                    blob,
                    url: previewUrl.value,
                    duration: finalDuration,
                    mimeType,
                });
            };

            if (mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
            } else {
                mediaRecorder.onstop();
            }
        });
    };

    const discardPreview = () => {
        revokePreview();
        error.value = null;
    };

    const reset = () => {
        clearTimer();
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            try {
                mediaRecorder.stop();
            } catch {
                /* ignore */
            }
        }
        mediaRecorder = null;
        isRecording.value = false;
        durationSec.value = 0;
        cleanupStream();
        revokePreview();
        error.value = null;
    };

    onUnmounted(reset);

    return {
        isRecording,
        durationSec,
        hasPreview,
        previewBlob,
        previewUrl,
        previewDuration,
        formattedDuration,
        formattedPreviewDuration,
        error,
        isSupported,
        permissionState,
        ensureMicrophoneReady,
        refreshPermission,
        startRecording,
        stopRecording,
        discardPreview,
        reset,
        formatAudioTime,
    };
}
