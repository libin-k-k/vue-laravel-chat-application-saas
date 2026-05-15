<script src="./EmojiPicker.js"></script>

<template>
    <div class="emoji-picker" @click.stop>
        <!-- Search -->
        <div class="emoji-picker__search-wrap">
            <svg class="emoji-picker__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35" stroke-linecap="round"/>
            </svg>
            <input
                v-model="searchQuery"
                type="text"
                class="emoji-picker__search"
                placeholder="Search emoji…"
            />
        </div>

        <!-- Category tabs -->
        <div class="emoji-picker__categories">
            <button
                v-for="cat in CATEGORY_ICONS"
                :key="cat.key"
                type="button"
                class="emoji-picker__cat-btn"
                :class="{ 'emoji-picker__cat-btn--active': activeCategory === cat.key }"
                :title="cat.label"
                @click="activeCategory = cat.key; searchQuery = ''"
            >
                {{ cat.icon }}
            </button>
        </div>

        <!-- Emoji grid -->
        <div class="emoji-picker__grid-wrap">
            <p v-if="!searchQuery" class="emoji-picker__cat-label">
                {{ activeCategory.split(' ').slice(1).join(' ') }}
            </p>
            <div class="emoji-picker__grid">
                <button
                    v-for="emoji in filteredEmojis"
                    :key="emoji"
                    type="button"
                    class="emoji-picker__emoji-btn"
                    :title="emoji"
                    @click="selectEmoji(emoji)"
                >
                    {{ emoji }}
                </button>
            </div>
            <p v-if="filteredEmojis.length === 0" class="emoji-picker__empty">
                No emoji found
            </p>
        </div>
    </div>
</template>
