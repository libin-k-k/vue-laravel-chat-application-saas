<script src="./index.js"></script>

<template>
    <div class="chat-app" :class="{ 'chat-app--sidebar-open': sidebarOpen }">
        <div
            class="chat-app__sidebar"
            :class="{ 'chat-app__sidebar--visible': sidebarOpen }"
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
            />
        </div>

        <div
            class="chat-app__main"
            :class="{ 'chat-app__main--hidden-mobile': sidebarOpen && !selectedContact }"
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

        <div
            class="chat-app__overlay"
            :class="{ 'chat-app__overlay--show': !sidebarOpen && selectedContact === null }"
            @click="goBack"
        />
    </div>
</template>
