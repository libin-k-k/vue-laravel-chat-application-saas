<script src="./ChatHeader.js"></script>

<template>
    <header class="chat-header">
        <button type="button" class="chat-header__back" title="Back" @click="$emit('back')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 5l-7 7 7 7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>

        <div class="chat-header__info">
            <div class="chat-header__avatar-wrap">
                <img
                    v-if="contact.avatar"
                    :src="contact.avatar"
                    :alt="contact.name"
                    class="chat-header__avatar"
                />
                <span v-else class="chat-header__avatar chat-header__avatar--fallback">
                    {{ contact.name.charAt(0).toUpperCase() }}
                </span>
                <span v-if="contact.online" class="chat-header__online" />
            </div>
            <div class="chat-header__meta">
                <h2 class="chat-header__name">{{ contact.name }}</h2>
                <p class="chat-header__status">
                    <span v-if="contact.typing" class="chat-header__status--typing">
                        typing…
                    </span>
                    <span v-else-if="contact.online" class="chat-header__status--online">
                        <span class="chat-header__status-dot" /> Online
                    </span>
                    <span v-else-if="contact.lastSeen" class="chat-header__status--offline">
                        Last seen {{ contact.lastSeen }}
                    </span>
                    <span v-else class="chat-header__status--offline">Offline</span>
                </p>
            </div>
        </div>

        <div class="chat-header__actions">
            <button type="button" class="chat-header__action-btn" title="Voice call">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <button type="button" class="chat-header__action-btn" title="Video call">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="23 7 16 12 23 17 23 7"/>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
            </button>
            <button type="button" class="chat-header__action-btn" title="Search" @click="$emit('search')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35" stroke-linecap="round"/>
                </svg>
            </button>
            <button type="button" class="chat-header__action-btn" title="More options" @click="$emit('info')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="1"/>
                    <circle cx="19" cy="12" r="1"/>
                    <circle cx="5" cy="12" r="1"/>
                </svg>
            </button>
        </div>
    </header>
</template>
