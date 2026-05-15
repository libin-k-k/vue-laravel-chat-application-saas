<script src="./VerifyEmailResult.js"></script>

<template>
    <GuestLayout title="Email verification">
        <div class="auth-form-wrap">
            <div class="auth-form-wrap__head">
                <h2 class="auth-form-wrap__title">{{ title }}</h2>
                <p class="auth-form-wrap__subtitle">{{ message }}</p>
            </div>

            <div class="verify-result-card verify-result-card--error">
                <div class="verify-result-card__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                    </svg>
                </div>
            </div>

            <AppButton
                v-if="$page.props.auth?.user"
                type="button"
                variant="primary"
                size="lg"
                :block="true"
                :loading="form.processing"
                @click="resend"
            >
                {{ form.processing ? 'Sending…' : 'Resend verification email' }}
            </AppButton>

            <p v-else class="auth-form-wrap__switch">
                <Link :href="route('login')" class="auth-link">Sign in</Link>
                &nbsp;to request a new verification email.
            </p>

            <Link v-if="!$page.props.auth?.user" :href="route('register')" class="auth-link auth-form-wrap__switch">
                Create a new account
            </Link>
        </div>
    </GuestLayout>
</template>

<style scoped>
.verify-result-card {
    display: flex;
    justify-content: center;
    padding: 1rem;
    border-radius: 12px;
    text-align: center;
}

.verify-result-card--error {
    background: var(--color-danger-light);
    border: 1px solid #fecaca;
}

.verify-result-card__icon {
    width: 48px;
    height: 48px;
    color: var(--color-danger);
}

.verify-result-card__icon svg {
    width: 100%;
    height: 100%;
}
</style>
