<script src="./VoiceRecorderPanel.js"></script>

<template>
    <div class="voice-recorder-panel">
        <template v-if="isRecording">
            <div class="voice-recorder-panel__recording">
                <span class="voice-recorder-panel__rec-dot" aria-hidden="true" />
                <span class="voice-recorder-panel__timer">{{ durationLabel }}</span>
                <div class="voice-recorder-panel__wave" aria-hidden="true">
                    <span
                        v-for="n in 12"
                        :key="n"
                        class="voice-recorder-panel__bar"
                        :style="{ '--i': n }"
                    />
                </div>
                <span class="voice-recorder-panel__hint">Release to preview</span>
            </div>
        </template>

        <template v-else-if="previewUrl">
            <audio
                ref="audioEl"
                :src="previewUrl"
                preload="metadata"
                @loadedmetadata="onLoadedMetadata"
                @timeupdate="onTimeUpdate"
                @ended="onEnded"
                @pause="onPause"
            />

            <button
                type="button"
                class="voice-recorder-panel__play"
                :title="isPlaying ? 'Pause' : 'Play'"
                :aria-label="isPlaying ? 'Pause preview' : 'Play preview'"
                @click="togglePlayback"
            >
                <svg v-if="isPlaying" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                </svg>
            </button>

            <div class="voice-recorder-panel__preview-track">
                <div
                    class="voice-recorder-panel__preview-progress"
                    :style="{ width: playProgress + '%' }"
                />
                <div class="voice-recorder-panel__preview-wave" aria-hidden="true">
                    <span
                        v-for="n in 24"
                        :key="n"
                        class="voice-recorder-panel__preview-bar"
                    />
                </div>
            </div>

            <span class="voice-recorder-panel__preview-time">{{ timeLabel }}</span>

            <button
                type="button"
                class="voice-recorder-panel__discard"
                title="Discard"
                aria-label="Discard recording"
                @click="$emit('discard')"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path
                        d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </button>

            <button
                type="button"
                class="voice-recorder-panel__send"
                title="Send voice message"
                aria-label="Send voice message"
                @click="$emit('send')"
            >
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
            </button>
        </template>
    </div>
</template>
