<script src="./index.js"></script>

<template>
    <div
        class="chat-app"
        :class="{
            'chat-app--mobile-list': mobileView === 'list',
            'chat-app--mobile-chat': mobileView === 'chat',
        }"
    >
        <section
            class="chat-app__sidebar"
            aria-label="Conversations"
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
        </section>

        <section
            class="chat-app__main"
            aria-label="Chat"
        >
            <template v-if="selectedContact">
                <ChatHeader :contact="selectedContact" @back="goBack" />
                <ChatMessages
                    :messages="messages"
                    :auth-user-id="authId"
                    :auth-avatar="authAvatar"
                    :auth-name="authName"
                    :contact="selectedContact"
                    :loading="loadingMessages"
                    :loading-older="loadingOlder"
                    :has-more="hasMoreMessages"
                    :can-delete-message="canDeleteMessage"
                    @load-older="loadOlderMessages"
                    @delete="deleteMessage"
                />
                <ChatInput
                    @send="sendMessage"
                    @send-voice="sendVoiceMessage"
                    @typing="onComposerTyping"
                />
            </template>
            <ChatEmptyState v-else class="chat-app__empty-desktop" />
        </section>

        <ChatFab
            v-if="mobileView === 'list'"
            class="chat-app__fab"
            @click="onNewChat"
        />

        <NewChatModal
            v-if="showNewChatModal"
            @close="closeNewChatModal"
            @select="onSelectUser"
        />
    </div>
</template>
