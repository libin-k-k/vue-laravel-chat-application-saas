<script src="./ChatMessages.js"></script>

<template>
    <div ref="listRef" class="chat-messages">
        <template v-for="(group, gIdx) in groupedMessages" :key="gIdx">
            <div class="chat-messages__date-sep">
                <span>{{ group.date }}</span>
            </div>
            <template v-for="(msg, mIdx) in group.messages" :key="msg.id">
                <ChatMessage
                    :message="msg"
                    :is-mine="msg.senderId === authUserId"
                    :show-avatar="showAvatar(group.messages, mIdx)"
                    :contact-name="contact.name"
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
