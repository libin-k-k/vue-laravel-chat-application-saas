<script src="./ChatSidebar.js"></script>

<template>
    <aside class="chat-sidebar">
        <LogoutConfirmModal
            v-if="showLogoutModal"
            @confirm="confirmLogout"
            @cancel="showLogoutModal = false"
        />

        <div class="chat-sidebar__header">
            <Link :href="route('profile.edit')" class="chat-sidebar__avatar" :title="authUser.name">
                <img
                    v-if="authUser.profile_photo_url"
                    :src="authUser.profile_photo_url"
                    :alt="authUser.name"
                />
                <span v-else>{{ authUser.name.charAt(0).toUpperCase() }}</span>
            </Link>

            <div class="chat-sidebar__header-actions">
                <button
                    type="button"
                    class="chat-sidebar__icon-btn chat-sidebar__icon-btn--new-chat"
                    title="New chat"
                    aria-label="New chat"
                    @click="$emit('new-chat')"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M12 5v14M5 12h14" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <ThemeToggle />
                <button
                    type="button"
                    class="chat-sidebar__icon-btn chat-sidebar__icon-btn--logout"
                    title="Log out"
                    aria-label="Log out"
                    @click="requestLogout"
                >
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
