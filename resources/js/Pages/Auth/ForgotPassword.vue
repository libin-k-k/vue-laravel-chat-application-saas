<script src="./ForgotPassword.js"></script>

<template>
    <GuestLayout title="Forgot password">
        <div class="auth-form-wrap">
            <div v-if="status" class="auth-status">
                <svg viewBox="0 0 20 20" fill="currentColor" class="auth-status__icon">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
                </svg>
                {{ status }}
            </div>

            <div class="auth-form-wrap__head">
                <h2 class="auth-form-wrap__title">Forgot your password?</h2>
                <p class="auth-form-wrap__subtitle">
                    Enter your email and we'll send you a link to choose a new password.
                </p>
            </div>

            <form class="auth-form" @submit.prevent="submit" novalidate>
                <AppInput
                    id="email"
                    v-model="form.email"
                    type="email"
                    label="Email address"
                    placeholder="you@example.com"
                    autocomplete="username"
                    required
                    autofocus
                    :error="form.errors.email"
                />

                <AppButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    :loading="form.processing"
                    :block="true"
                >
                    {{ form.processing ? 'Sending link…' : 'Email reset link' }}
                </AppButton>
            </form>

            <p class="auth-form-wrap__switch">
                Remember your password?&nbsp;
                <Link :href="route('login')" class="auth-link">Back to sign in</Link>
            </p>
        </div>
    </GuestLayout>
</template>
