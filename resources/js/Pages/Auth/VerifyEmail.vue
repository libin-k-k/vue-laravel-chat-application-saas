<script src="./VerifyEmail.js"></script>

<template>
    <GuestLayout title="Verify email">
        <div class="auth-form-wrap">
            <div v-if="statusMessage()" class="auth-status">
                <svg viewBox="0 0 20 20" fill="currentColor" class="auth-status__icon">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
                </svg>
                {{ statusMessage() }}
            </div>

            <div class="auth-form-wrap__head">
                <h2 class="auth-form-wrap__title">Check your inbox</h2>
                <p class="auth-form-wrap__subtitle">
                    We sent a verification link to your email. The link expires in
                    <strong>{{ expireMinutes }} minutes</strong> and works only once.
                </p>
            </div>

            <div class="verify-email-card">
                <div class="verify-email-card__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
                    </svg>
                </div>
                <p class="verify-email-card__hint">
                    Open the email and tap <strong>Verify email address</strong> to activate your account.
                </p>
            </div>

            <AppButton
                type="button"
                variant="primary"
                size="lg"
                :block="true"
                :loading="form.processing"
                @click="resend"
            >
                {{ form.processing ? 'Sending…' : 'Resend verification email' }}
            </AppButton>

            <AppButton
                type="button"
                variant="secondary"
                size="md"
                :block="true"
                :loading="logoutForm.processing"
                @click="logout"
            >
                Sign out
            </AppButton>
        </div>
    </GuestLayout>
</template>

<style scoped>
.verify-email-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 1.25rem 1rem;
    background: var(--color-success-light);
    border: 1px solid var(--color-primary-200);
    border-radius: 12px;
    text-align: center;
}

.verify-email-card__icon {
    width: 48px;
    height: 48px;
    color: var(--color-primary-600);
}

.verify-email-card__icon svg {
    width: 100%;
    height: 100%;
}

.verify-email-card__hint {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.5;
    color: var(--color-text-secondary);
}

.verify-email-card__hint strong {
    color: var(--color-primary-700);
}
</style>
