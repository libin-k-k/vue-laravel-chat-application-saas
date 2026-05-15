import { defineComponent, ref, computed, watch, onUnmounted } from 'vue';
import { formatAudioTime } from '@/Composables/useMicrophone';

export default defineComponent({
    name: 'VoiceMessagePlayer',

    props: {
        url: { type: String, required: true },
        duration: { type: Number, default: 0 },
        isMine: { type: Boolean, default: false },
    },

    setup(props) {
        const audioEl = ref(null);
        const isPlaying = ref(false);
        const progress = ref(0);
        const currentTime = ref(0);
        const audioDuration = ref(props.duration || 0);

        const syncDuration = () => {
            const meta = audioEl.value?.duration;
            if (Number.isFinite(meta) && meta > 0) {
                audioDuration.value = meta;
            } else if (props.duration > 0) {
                audioDuration.value = props.duration;
            }
        };

        const stopPlayback = () => {
            if (!audioEl.value) {
                isPlaying.value = false;
                progress.value = 0;
                currentTime.value = 0;
                return;
            }

            audioEl.value.pause();
            audioEl.value.currentTime = 0;
            isPlaying.value = false;
            progress.value = 0;
            currentTime.value = 0;
        };

        const toggle = async () => {
            if (!audioEl.value) return;

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
                progress.value = Math.min(100, (el.currentTime / dur) * 100);
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
            syncDuration();
        };

        const timeLabel = computed(() => {
            const total = audioDuration.value || props.duration || 0;

            if (isPlaying.value) {
                return `${formatAudioTime(currentTime.value)} / ${formatAudioTime(total)}`;
            }

            return formatAudioTime(total);
        });

        watch(() => props.url, () => stopPlayback());
        watch(() => props.duration, (dur) => {
            if (dur > 0 && !isPlaying.value) {
                audioDuration.value = dur;
            }
        });

        onUnmounted(stopPlayback);

        return {
            audioEl,
            isPlaying,
            progress,
            timeLabel,
            toggle,
            onTimeUpdate,
            onEnded,
            onPause,
            onLoadedMetadata,
        };
    },
});
