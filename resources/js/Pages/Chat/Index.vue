<script src="./index.js"></script>

<template>
    <div class="chat-app">
        <div
            class="chat-app__sidebar"
            :class="{ 'chat-app__sidebar--visible': sidebarOpen || !selectedContact }"
        >
            <ChatSidebar
                v-if="authUser"
                :contacts="contacts"
                :selected-id="selectedContact?.id ?? null"
                :auth-user="authUser"
                :search-query="searchQuery"
                @select="selectContact"
                @update:search-query="searchQuery = $event"
                @logout="logout"
                @new-chat="onNewChat"
            />
        </div>

        <div
            class="chat-app__main"
            :class="{ 'chat-app__main--hidden-mobile': !selectedContact }"
        >
            <template v-if="selectedContact">
                <ChatHeader :contact="selectedContact" @back="goBack" />
                <ChatMessages
                    :messages="messages"
                    :auth-user-id="authId"
                    :contact="selectedContact"
                />
                <ChatInput @send="sendMessage" />
            </template>
            <ChatEmptyState v-else />
        </div>

        <ChatFab v-if="!selectedContact" @click="onNewChat" />

        <NewChatModal
            v-if="showNewChatModal"
            @close="closeNewChatModal"
            @select="onSelectUser"
        />
    </div>
</template>
