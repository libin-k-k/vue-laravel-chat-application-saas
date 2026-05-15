<script src="./ResetPassword.js"></script>

<template>
    <GuestLayout title="Reset password">
        <div class="auth-form-wrap">
            <div class="auth-form-wrap__head">
                <h2 class="auth-form-wrap__title">Choose a new password</h2>
                <p class="auth-form-wrap__subtitle">
                    Enter your new password below. The link in your email expires after one hour.
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
                    :error="form.errors.email"
                />

                <AppInput
                    id="password"
                    v-model="form.password"
                    type="password"
                    label="New password"
                    placeholder="••••••••"
                    autocomplete="new-password"
                    required
                    autofocus
                    :error="form.errors.password"
                />

                <AppInput
                    id="password_confirmation"
                    v-model="form.password_confirmation"
                    type="password"
                    label="Confirm new password"
                    placeholder="••••••••"
                    autocomplete="new-password"
                    required
                    :error="form.errors.password_confirmation"
                />

                <AppButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    :loading="form.processing"
                    :block="true"
                >
                    {{ form.processing ? 'Updating…' : 'Reset password' }}
                </AppButton>
            </form>

            <p class="auth-form-wrap__switch">
                <Link :href="route('login')" class="auth-link">Back to sign in</Link>
            </p>
        </div>
    </GuestLayout>
</template>
