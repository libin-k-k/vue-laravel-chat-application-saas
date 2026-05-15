import { defineComponent, ref, computed, watch, onUnmounted } from 'vue';
import { formatAudioTime } from '@/Composables/useMicrophone';

export default defineComponent({
    name: 'VoiceRecorderPanel',

    props: {
        isRecording: { type: Boolean, default: false },
        durationLabel: { type: String, default: '0:00' },
        previewUrl: { type: String, default: null },
        previewDuration: { type: Number, default: 0 },
    },

    emits: ['discard', 'send'],

    setup(props) {
        const isPlaying = ref(false);
        const playProgress = ref(0);
        const currentTime = ref(0);
        const audioDuration = ref(0);
        const audioEl = ref(null);

        const syncDurationFromAudio = () => {
            const el = audioEl.value;
            if (!el) return;

            const meta = el.duration;
            if (Number.isFinite(meta) && meta > 0) {
                audioDuration.value = meta;
            } else if (props.previewDuration > 0) {
                audioDuration.value = props.previewDuration;
            }
        };

        const stopPlayback = () => {
            if (!audioEl.value) {
                isPlaying.value = false;
                playProgress.value = 0;
                currentTime.value = 0;
                return;
            }

            audioEl.value.pause();
            audioEl.value.currentTime = 0;
            isPlaying.value = false;
            playProgress.value = 0;
            currentTime.value = 0;
        };

        const togglePlayback = async () => {
            if (!audioEl.value || !props.previewUrl) return;

            if (isPlaying.value) {
                audioEl.value.pause();
                isPlaying.value = false;
                return;
            }

            try {
                await audioEl.value.play();
                isPlaying.value = true;
            } catch {
                isPlaying.value = false;
            }
        };

        const onTimeUpdate = () => {
            const el = audioEl.value;
            if (!el) return;

            currentTime.value = el.currentTime;
            const dur = el.duration && Number.isFinite(el.duration) ? el.duration : audioDuration.value;

            if (dur > 0) {
                playProgress.value = Math.min(100, (el.currentTime / dur) * 100);
            }
        };

        const onEnded = () => {
            stopPlayback();
        };

        const onPause = () => {
            if (audioEl.value?.ended) return;
            isPlaying.value = false;
        };

        const onLoadedMetadata = () => {
            syncDurationFromAudio();
        };

        const timeLabel = computed(() => {
            const total = audioDuration.value || props.previewDuration || 0;

            if (isPlaying.value) {
                return `${formatAudioTime(currentTime.value)} / ${formatAudioTime(total)}`;
            }

            return formatAudioTime(total);
        });

        watch(
            () => props.previewUrl,
            (url, prev) => {
                if (url !== prev) {
                    stopPlayback();
                    audioDuration.value = props.previewDuration || 0;
                }
            },
        );

        watch(
            () => props.previewDuration,
            (dur) => {
                if (dur > 0 && !isPlaying.value) {
                    audioDuration.value = dur;
                }
            },
        );

        watch(
            () => props.isRecording,
            (recording) => {
                if (recording) stopPlayback();
            },
        );

        onUnmounted(stopPlayback);

        return {
            isPlaying,
            playProgress,
            currentTime,
            audioEl,
            timeLabel,
            togglePlayback,
            onTimeUpdate,
            onEnded,
            onPause,
            onLoadedMetadata,
            stopPlayback,
        };
    },
});
