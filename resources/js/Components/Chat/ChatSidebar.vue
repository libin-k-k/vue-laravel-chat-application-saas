<script src="./ChatSidebar.js"></script>

<template>
    <aside class="chat-sidebar">
        <div class="chat-sidebar__header">
            <div class="chat-sidebar__header-left">
                <div class="chat-sidebar__avatar" :title="authUser.name">
                    <span>{{ authUser.name.charAt(0).toUpperCase() }}</span>
                </div>
                <div class="chat-sidebar__user-info">
                    <span class="chat-sidebar__app-name">{{ authUser.name }}</span>
                    <span class="chat-sidebar__user-email">{{ authUser.email }}</span>
                </div>
            </div>
            <div class="chat-sidebar__header-actions">
                <ThemeToggle />
                <button type="button" class="chat-sidebar__icon-btn" title="New chat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button type="button" class="chat-sidebar__icon-btn" title="Log out" @click="$emit('logout')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>

        <div class="chat-sidebar__search">
            <div class="chat-sidebar__search-wrap">
                <svg class="chat-sidebar__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35" stroke-linecap="round"/>
                </svg>
                <input
                    :value="searchQuery"
                    type="search"
                    class="chat-sidebar__search-input"
                    placeholder="Search conversations…"
                    @input="$emit('update:searchQuery', $event.target.value)"
                />
            </div>
        </div>

        <div class="chat-sidebar__section-label">
            <span>All conversations</span>
            <span class="chat-sidebar__count">{{ filteredContacts.length }}</span>
        </div>

        <div class="chat-sidebar__list">
            <template v-if="filteredContacts.length">
                <ChatContactItem
                    v-for="contact in filteredContacts"
                    :key="contact.id"
                    :contact="contact"
                    :active="contact.id === selectedId"
                    @click="$emit('select', contact)"
                />
            </template>
            <div v-else class="chat-sidebar__empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35" stroke-linecap="round"/>
                </svg>
                <p>No conversations found</p>
            </div>
        </div>
    </aside>
</template>
