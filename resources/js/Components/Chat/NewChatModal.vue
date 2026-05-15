<script src="./NewChatModal.js"></script>

<template>
    <div
        class="new-chat-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-chat-modal-title"
    >
        <div class="new-chat-modal__backdrop" @click="close" />
        <div class="new-chat-modal__panel">
            <header class="new-chat-modal__header">
                <h2 id="new-chat-modal-title" class="new-chat-modal__title">New chat</h2>
                <button
                    type="button"
                    class="new-chat-modal__close"
                    aria-label="Close"
                    @click="close"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </header>

            <div class="new-chat-modal__search">
                <svg class="new-chat-modal__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35" stroke-linecap="round"/>
                </svg>
                <input
                    ref="inputRef"
                    v-model="query"
                    type="search"
                    class="new-chat-modal__search-input"
                    placeholder="Search by name or username…"
                    autocomplete="off"
                />
            </div>

            <div class="new-chat-modal__body">
                <p v-if="loading" class="new-chat-modal__status">Searching…</p>

                <p v-else-if="query.trim().length >= 2 && error" class="new-chat-modal__status new-chat-modal__status--error">
                    {{ error }}
                </p>

                <p v-else-if="query.trim().length >= 2 && searched && results.length === 0" class="new-chat-modal__status">
                    No users found
                </p>

                <ul v-else-if="results.length" class="new-chat-modal__list">
                    <li v-for="user in results" :key="user.id">
                        <button
                            type="button"
                            class="new-chat-modal__user"
                            @click="selectUser(user)"
                        >
                            <span class="new-chat-modal__avatar">
                                <img
                                    v-if="user.profile_photo_url"
                                    :src="user.profile_photo_url"
                                    :alt="user.name"
                                />
                                <span v-else>{{ user.name.charAt(0).toUpperCase() }}</span>
                            </span>
                            <span class="new-chat-modal__user-info">
                                <span class="new-chat-modal__user-name">{{ user.name }}</span>
                                <span class="new-chat-modal__user-meta">
                                    @{{ user.username }}
                                    <template v-if="user.email"> · {{ user.email }}</template>
                                </span>
                            </span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
