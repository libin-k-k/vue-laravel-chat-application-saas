<script src="./ChatFab.js"></script>

<template>
    <button
        type="button"
        class="chat-fab"
        title="New chat"
        aria-label="New chat"
        @click="$emit('click')"
    >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </button>
</template>
