<script src="./ChatMessages.js"></script>

<template>
    <div ref="listRef" class="chat-messages">
        <div v-if="loadingOlder" class="chat-messages__load-more">Loading older messages…</div>
        <div v-else-if="hasMore" class="chat-messages__load-more chat-messages__load-more--hint">
            Scroll up for older messages
        </div>

        <div v-if="loading" class="chat-messages__loading">Loading messages…</div>

        <template v-for="(group, gIdx) in groupedMessages" :key="gIdx">
            <div class="chat-messages__date-sep">
                <span>{{ group.date }}</span>
            </div>
            <template v-for="(msg, mIdx) in group.messages" :key="msg.id">
                <ChatMessage
                    :message="msg"
                    :is-mine="isMineMessage(msg)"
                    :show-avatar="showAvatar(group.messages, mIdx)"
                    :contact-name="contact.name"
                    :contact-avatar="contact.avatar"
                    :my-avatar="authAvatar"
                    :my-name="authName"
                    :can-delete="canDeleteMessage(msg)"
                    @delete="$emit('delete', $event)"
                />
            </template>
        </template>

        <div v-if="contact.typing" class="chat-messages__typing">
            <div class="chat-messages__typing-bubble">
                <span /><span /><span />
            </div>
            <p class="chat-messages__typing-label">{{ contact.name }} is typing…</p>
        </div>

        <div class="chat-messages__pad" />
    </div>
</template>
