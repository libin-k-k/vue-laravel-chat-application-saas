<script src="./VoiceMessagePlayer.js"></script>

<template>
    <div
        class="voice-msg-player"
        :class="{ 'voice-msg-player--mine': isMine, 'voice-msg-player--playing': isPlaying }"
    >
        <audio
            ref="audioEl"
            :src="url"
            preload="metadata"
            @loadedmetadata="onLoadedMetadata"
            @timeupdate="onTimeUpdate"
            @ended="onEnded"
            @pause="onPause"
        />

        <button
            type="button"
            class="voice-msg-player__btn"
            :aria-label="isPlaying ? 'Pause voice message' : 'Play voice message'"
            @click="toggle"
        >
            <svg v-if="isPlaying" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
            </svg>
        </button>

        <div class="voice-msg-player__track">
            <div class="voice-msg-player__fill" :style="{ width: progress + '%' }" />
            <div class="voice-msg-player__bars" aria-hidden="true">
                <span v-for="n in 20" :key="n" class="voice-msg-player__bar" />
            </div>
        </div>

        <span class="voice-msg-player__time">{{ timeLabel }}</span>
    </div>
</template>
