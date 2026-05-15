<script src="./PrivacyPrivateModal.js"></script>

<template>
    <div class="privacy-modal" role="dialog" aria-modal="true" aria-labelledby="privacy-modal-title">
        <div class="privacy-modal__backdrop" @click="$emit('cancel')" />
        <div class="privacy-modal__panel">
            <div class="privacy-modal__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h2 id="privacy-modal-title" class="privacy-modal__title">Switch to private profile?</h2>
            <p class="privacy-modal__message">
                If private profile, other users can't view and if any user send message once you accept then that user can send message.
            </p>
            <div class="privacy-modal__actions">
                <button type="button" class="privacy-modal__btn privacy-modal__btn--secondary" @click="$emit('cancel')">
                    Cancel
                </button>
                <button type="button" class="privacy-modal__btn privacy-modal__btn--primary" @click="$emit('confirm')">
                    Enable private
                </button>
            </div>
        </div>
    </div>
</template>
