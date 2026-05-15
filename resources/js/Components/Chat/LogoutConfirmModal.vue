<script src="./LogoutConfirmModal.js"></script>

<template>
    <div class="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="logout-modal-title">
        <div class="confirm-modal__backdrop" @click="$emit('cancel')" />
        <div class="confirm-modal__panel">
            <div class="confirm-modal__icon confirm-modal__icon--warning" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h2 id="logout-modal-title" class="confirm-modal__title">Sign out?</h2>
            <p class="confirm-modal__message">
                Are you sure you want to log out of your account?
            </p>
            <div class="confirm-modal__actions">
                <button type="button" class="confirm-modal__btn confirm-modal__btn--secondary" @click="$emit('cancel')">
                    Cancel
                </button>
                <button type="button" class="confirm-modal__btn confirm-modal__btn--danger" @click="$emit('confirm')">
                    Log out
                </button>
            </div>
        </div>
    </div>
</template>
