<script src="./ChatMessage.js"></script>

<template>
    <div
        class="chat-msg"
        :class="isMine ? 'chat-msg--out' : 'chat-msg--in'"
        @contextmenu="onContextMenu"
        @touchstart.passive="onTouchStart"
        @touchend="onTouchEnd"
        @touchcancel="onTouchEnd"
    >
        <div v-if="showAvatar" class="chat-msg__avatar-col">
            <div class="chat-msg__avatar">
                <img
                    v-if="avatarUrl"
                    :src="avatarUrl"
                    :alt="avatarLabel"
                />
                <span v-else>{{ avatarLabel.charAt(0).toUpperCase() }}</span>
            </div>
        </div>
        <div v-else class="chat-msg__avatar-col">
            <div class="chat-msg__avatar-spacer" />
        </div>

        <div class="chat-msg__wrap">
            <div
                class="chat-msg__bubble"
                :class="{ 'chat-msg__bubble--deleted': message.isDeleted }"
            >
                <p v-if="message.isDeleted" class="chat-msg__deleted">
                    Message deleted
                </p>

                <template v-else>
                    <div v-if="message.image" class="chat-msg__image-wrap">
                        <img :src="message.image" :alt="message.imageAlt || 'Image'" class="chat-msg__image" />
                    </div>

                    <VoiceMessagePlayer
                        v-if="message.voice"
                        :url="message.voice.url"
                        :duration="message.voice.duration"
                        :is-mine="isMine"
                    />

                    <p v-if="message.text" class="chat-msg__text">{{ message.text }}</p>
                </template>

                <div class="chat-msg__foot">
                    <span class="chat-msg__time">{{ message.time }}</span>
                    <span
                        v-if="isMine && !message.isDeleted"
                        class="chat-msg__status"
                        :title="message.status === 'read' ? 'Seen' : 'Sent'"
                    >
                        <svg
                            v-if="message.status === 'read'"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            class="chat-msg__status--read"
                        >
                            <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" stroke-linecap="round" stroke-linejoin="round"/>
                            <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none"/>
                        </svg>
                        <svg v-else viewBox="0 0 16 16" fill="currentColor">
                            <path d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z"/>
                        </svg>
                    </span>
                </div>
            </div>
        </div>

        <Teleport to="body">
            <div
                v-if="menuOpen"
                class="chat-msg__menu"
                :style="{ top: `${menuPos.y}px`, left: `${menuPos.x}px` }"
                @click.stop
            >
                <button type="button" class="chat-msg__menu-btn" @click="onDelete">
                    Delete message
                </button>
            </div>
        </Teleport>
    </div>
</template>
