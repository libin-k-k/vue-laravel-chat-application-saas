<script src="./ChatInput.js"></script>

<template>
    <div class="chat-input-bar">

        <!-- Emoji button + picker -->
        <div class="chat-input-bar__popup-wrap" @click.stop>
            <button
                type="button"
                class="chat-input-bar__icon-btn"
                :class="{ 'chat-input-bar__icon-btn--active': showEmojiPicker }"
                title="Emoji"
                :disabled="disabled"
                @click="toggleEmojiPicker"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 13s1.5 2 4 2 4-2 4-2" stroke-linecap="round"/>
                    <line x1="9" y1="9" x2="9.01" y2="9" stroke-linecap="round" stroke-width="3"/>
                    <line x1="15" y1="9" x2="15.01" y2="9" stroke-linecap="round" stroke-width="3"/>
                </svg>
            </button>

            <EmojiPicker
                v-if="showEmojiPicker"
                @select="onEmojiSelect"
                @close="showEmojiPicker = false"
            />
        </div>

        <!-- Attachment button + menu -->
        <div class="chat-input-bar__popup-wrap" @click.stop>
            <button
                type="button"
                class="chat-input-bar__icon-btn"
                :class="{ 'chat-input-bar__icon-btn--active': showAttachmentMenu }"
                title="Attach file"
                :disabled="disabled"
                @click="toggleAttachmentMenu"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>

            <AttachmentMenu
                v-if="showAttachmentMenu"
                @file-selected="onFileSelected"
                @close="showAttachmentMenu = false"
            />
        </div>

        <!-- Textarea -->
        <div class="chat-input-bar__field-wrap">
            <textarea
                ref="inputRef"
                v-model="text"
                class="chat-input-bar__field"
                placeholder="Type a message…"
                rows="1"
                :disabled="disabled"
                @keydown="onKeydown"
                @input="autoResize"
            />
        </div>

        <!-- Send / Mic button -->
        <button
            type="button"
            class="chat-input-bar__send-btn"
            :class="{ 'chat-input-bar__send-btn--active': hasText }"
            :title="hasText ? 'Send message' : 'Voice message'"
            :disabled="disabled"
            @click="send"
        >
            <svg v-if="hasText" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    </div>
</template>
