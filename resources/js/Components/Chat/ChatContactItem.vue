<script src="./ChatContactItem.js"></script>

<template>
    <button
        type="button"
        class="contact-item"
        :class="{ 'contact-item--active': active }"
    >
        <div class="contact-item__avatar-wrap">
            <img
                v-if="contact.avatar"
                :src="contact.avatar"
                :alt="contact.name"
                class="contact-item__avatar"
            />
            <span v-else class="contact-item__avatar contact-item__avatar--fallback">
                {{ contact.name.charAt(0).toUpperCase() }}
            </span>
            <span v-if="contact.online" class="contact-item__online" title="Online" />
        </div>

        <div class="contact-item__body">
            <div class="contact-item__row">
                <span class="contact-item__name">{{ contact.name }}</span>
                <span v-if="contact.lastTime" class="contact-item__time">{{ contact.lastTime }}</span>
            </div>
            <div class="contact-item__row">
                <span
                    class="contact-item__preview"
                    :class="{
                        'contact-item__preview--unread': contact.unread,
                        'contact-item__preview--typing': contact.typing,
                    }"
                >
                    <template v-if="contact.typing">
                        <span class="contact-item__typing-dots"><span /><span /><span /></span>
                        typing…
                    </template>
                    <template v-else>
                        <span v-if="contact.isMine" class="contact-item__tick" title="Sent">
                            <svg viewBox="0 0 16 16" fill="currentColor">
                                <path d="M10.97 4.97a.75.75 0 011.07 1.05l-3.99 4.99a.75.75 0 01-1.08.02L4.324 8.384a.75.75 0 111.06-1.06l2.094 2.093 3.473-4.425a.252.252 0 01.02-.022z"/>
                                <path d="M7.97 4.97a.75.75 0 011.07 1.05L5.05 11.01a.75.75 0 01-1.08.02L1.324 8.384a.75.75 0 011.06-1.06l2.094 2.093L7.97 4.97z"/>
                            </svg>
                        </span>
                        {{ contact.lastMessage || 'Start a conversation' }}
                    </template>
                </span>
                <span v-if="contact.unread" class="contact-item__badge">
                    {{ contact.unread > 99 ? '99+' : contact.unread }}
                </span>
                <span v-else-if="contact.muted" class="contact-item__muted" title="Muted">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                    </svg>
                </span>
            </div>
        </div>
    </button>
</template>
