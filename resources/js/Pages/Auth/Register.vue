<script src="./Register.js"></script>

<template>
    <GuestLayout title="Create account">
        <div class="auth-form-wrap">
            <div class="auth-form-wrap__head">
                <h2 class="auth-form-wrap__title">Create your account</h2>
                <p class="auth-form-wrap__subtitle">Start chatting in seconds — it's free</p>
            </div>

            <form class="auth-form" @submit.prevent="submit" novalidate>
                <AppInput
                    id="name"
                    v-model="form.name"
                    type="text"
                    label="Full name"
                    placeholder="John Doe"
                    autocomplete="name"
                    required
                    autofocus
                    :error="form.errors.name"
                />

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
                    label="Password"
                    placeholder="Min. 8 characters"
                    autocomplete="new-password"
                    required
                    :error="form.errors.password"
                />

                <AppInput
                    id="password_confirmation"
                    v-model="form.password_confirmation"
                    type="password"
                    label="Confirm password"
                    placeholder="Repeat your password"
                    autocomplete="new-password"
                    required
                    :error="form.errors.password_confirmation"
                />

                <p class="auth-form__terms">
                    By creating an account you agree to our
                    <a href="#" class="auth-link">Terms of Service</a> and
                    <a href="#" class="auth-link">Privacy Policy</a>.
                </p>

                <AppButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    :loading="form.processing"
                    :block="true"
                >
                    {{ form.processing ? 'Creating account…' : 'Create account' }}
                </AppButton>
            </form>

            <p class="auth-form-wrap__switch">
                Already have an account?&nbsp;
                <Link :href="route('login')" class="auth-link">Sign in</Link>
            </p>
        </div>
    </GuestLayout>
</template>
