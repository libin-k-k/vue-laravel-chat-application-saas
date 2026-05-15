<script src="./AttachmentMenu.js"></script>

<template>
    <div class="attach-menu" @click.stop>
        <!-- Image -->
        <button type="button" class="attach-menu__item" @click="openImages">
            <span class="attach-menu__icon attach-menu__icon--image">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                </svg>
            </span>
            <span class="attach-menu__label">Image</span>
        </button>

        <!-- Video -->
        <button type="button" class="attach-menu__item" @click="openVideos">
            <span class="attach-menu__icon attach-menu__icon--video">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="23 7 16 12 23 17 23 7"/>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
            </span>
            <span class="attach-menu__label">Video</span>
        </button>

        <!-- Document -->
        <button type="button" class="attach-menu__item" @click="openDocuments">
            <span class="attach-menu__icon attach-menu__icon--document">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                </svg>
            </span>
            <span class="attach-menu__label">Document</span>
        </button>

        <!-- Hidden file inputs -->
        <input
            ref="imageInput"
            type="file"
            accept="image/*"
            multiple
            class="attach-menu__file-input"
            @change="onFileChange($event, 'image')"
        />
        <input
            ref="videoInput"
            type="file"
            accept="video/*"
            multiple
            class="attach-menu__file-input"
            @change="onFileChange($event, 'video')"
        />
        <input
            ref="documentInput"
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
            multiple
            class="attach-menu__file-input"
            @change="onFileChange($event, 'document')"
        />
    </div>
</template>
