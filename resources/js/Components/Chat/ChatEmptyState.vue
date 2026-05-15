<script src="./ChatEmptyState.js"></script>

<template>
    <div class="chat-empty">
        <div class="chat-empty__icon">
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="40" fill="color-mix(in srgb, var(--color-primary-500) 10%, transparent)"/>
                <path d="M40 18C27.85 18 18 27.85 18 40c0 4.24 1.24 8.19 3.39 11.51L18 62l10.72-3.29A21.91 21.91 0 0040 62c12.15 0 22-9.85 22-22S52.15 18 40 18z" fill="var(--color-primary-500)" opacity="0.2"/>
                <path d="M40 20C28.95 20 20 28.95 20 40c0 4.03 1.18 7.79 3.21 10.94L20 60l9.22-2.98A19.92 19.92 0 0040 60c11.05 0 20-8.95 20-20S51.05 20 40 20z" stroke="var(--color-primary-500)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M32 37h16M32 43h10" stroke="var(--color-primary-500)" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </div>
        <h3 class="chat-empty__title">Your messages</h3>
        <p class="chat-empty__text">
            Select a conversation from the sidebar to start chatting,<br />
            or start a new conversation.
        </p>
        <div class="chat-empty__hint">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            End-to-end encrypted
        </div>
    </div>
</template>
