<script src="./ChatMessage.js"></script>

<template>
    <div class="chat-msg" :class="isMine ? 'chat-msg--out' : 'chat-msg--in'">
        <div v-if="!isMine" class="chat-msg__avatar-col">
            <div v-if="showAvatar" class="chat-msg__avatar">
                {{ contactName.charAt(0).toUpperCase() }}
            </div>
            <div v-else class="chat-msg__avatar-spacer" />
        </div>

        <div class="chat-msg__wrap">
            <div class="chat-msg__bubble">
                <div v-if="message.image" class="chat-msg__image-wrap">
                    <img :src="message.image" :alt="message.imageAlt || 'Image'" class="chat-msg__image" />
                </div>

                <p v-if="message.text" class="chat-msg__text">{{ message.text }}</p>

                <div class="chat-msg__foot">
                    <span class="chat-msg__time">{{ message.time }}</span>
                    <span v-if="isMine" class="chat-msg__status" :title="message.status">
                        <svg v-if="message.status === 'sent'" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z"/>
                        </svg>
                        <svg v-else-if="message.status === 'delivered'" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.97 4.97a.75.75 0 011.07 1.05l-3.99 4.99a.75.75 0 01-1.08.02L4.324 8.384a.75.75 0 111.06-1.06l2.094 2.093 3.473-4.425a.252.252 0 01.02-.022z"/>
                            <path d="M7.97 4.97a.75.75 0 011.07 1.05L5.05 11.01a.75.75 0 01-1.08.02L1.324 8.384a.75.75 0 011.06-1.06l2.094 2.093L7.97 4.97z"/>
                        </svg>
                        <svg v-else-if="message.status === 'read'" viewBox="0 0 20 20" fill="currentColor" class="chat-msg__status--read">
                            <path d="M10.97 4.97a.75.75 0 011.07 1.05l-3.99 4.99a.75.75 0 01-1.08.02L4.324 8.384a.75.75 0 111.06-1.06l2.094 2.093 3.473-4.425a.252.252 0 01.02-.022z"/>
                            <path d="M7.97 4.97a.75.75 0 011.07 1.05L5.05 11.01a.75.75 0 01-1.08.02L1.324 8.384a.75.75 0 011.06-1.06l2.094 2.093L7.97 4.97z"/>
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
