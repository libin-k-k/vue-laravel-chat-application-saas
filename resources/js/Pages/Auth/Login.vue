<script src="./Login.js"></script>

<template>
    <GuestLayout title="Sign in">
        <div class="auth-form-wrap">
            <!-- Status banner -->
            <div v-if="status" class="auth-status">
                <svg viewBox="0 0 20 20" fill="currentColor" class="auth-status__icon">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
                </svg>
                {{ status }}
            </div>

            <div class="auth-form-wrap__head">
                <h2 class="auth-form-wrap__title">Welcome back</h2>
                <p class="auth-form-wrap__subtitle">Sign in to your account to continue</p>
            </div>

            <form class="auth-form" @submit.prevent="submit" novalidate>
                <AppInput
                    id="login"
                    v-model="form.login"
                    type="text"
                    label="Email or username"
                    placeholder="you@example.com or john_doe"
                    autocomplete="username"
                    required
                    autofocus
                    :error="form.errors.login"
                />

                <div class="auth-form__pw-group">
                    <AppInput
                        id="password"
                        v-model="form.password"
                        type="password"
                        label="Password"
                        placeholder="••••••••"
                        autocomplete="current-password"
                        required
                        :error="form.errors.password"
                    />
                    <Link
                        v-if="canResetPassword"
                        :href="route('password.request')"
                        class="auth-form__forgot"
                    >
                        Forgot password?
                    </Link>
                </div>

                <label class="auth-form__remember">
                    <input v-model="form.remember" type="checkbox" class="auth-form__checkbox" />
                    <span>Keep me signed in</span>
                </label>

                <AppButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    :loading="form.processing"
                    :block="true"
                >
                    {{ form.processing ? 'Signing in…' : 'Sign in' }}
                </AppButton>
            </form>

            <p class="auth-form-wrap__switch">
                Don't have an account?&nbsp;
                <Link :href="route('register')" class="auth-link">Create one for free</Link>
            </p>
        </div>
    </GuestLayout>
</template>
