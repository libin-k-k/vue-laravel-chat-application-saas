<script src="./Register.js"></script>

<template>
    <GuestLayout title="Create account">
        <div class="auth-form-wrap auth-form-wrap--register">
            <div class="auth-form-wrap__head">
                <h2 class="auth-form-wrap__title">Create your account</h2>
                <p class="auth-form-wrap__subtitle">Start chatting in seconds — it's free</p>
            </div>

            <form class="auth-form" @submit.prevent="submit" novalidate>

                <!-- Row 1: Full name + Username -->
                <div class="auth-form__row">
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

                    <div class="auth-field">
                        <label class="form-label" for="username">
                            Username <span class="auth-field__required">*</span>
                        </label>

                        <div class="username-field__wrap">
                            <span class="username-field__prefix">@</span>
                            <input
                                id="username"
                                v-model="form.username"
                                type="text"
                                class="form-input username-field__input"
                                :class="{
                                    'form-input--error': form.errors.username || usernameStatus === 'invalid' || usernameStatus === 'taken',
                                    'form-input--success': usernameStatus === 'available'
                                }"
                                placeholder="john_doe"
                                autocomplete="username"
                                spellcheck="false"
                                required
                                @input="onUsernameInput"
                            />
                            <span class="username-field__status-icon">
                                <svg v-if="usernameStatus === 'checking'" class="username-status-icon username-status-icon--spin" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="40 20"/>
                                </svg>
                                <svg v-else-if="usernameStatus === 'available'" class="username-status-icon username-status-icon--available" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                <svg v-else-if="usernameStatus === 'taken' || usernameStatus === 'invalid'" class="username-status-icon username-status-icon--taken" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </span>
                        </div>

                        <p v-if="form.errors.username" class="auth-field__error">{{ form.errors.username }}</p>
                        <p
                            v-else-if="usernameMessage"
                            class="auth-field__status-msg"
                            :class="{
                                'auth-field__status-msg--available': usernameStatus === 'available',
                                'auth-field__status-msg--taken': usernameStatus === 'taken' || usernameStatus === 'invalid',
                            }"
                        >{{ usernameMessage }}</p>

                        <div v-if="usernameSuggestions.length" class="username-suggestions">
                            <span class="username-suggestions__label">Try:</span>
                            <button
                                v-for="s in usernameSuggestions"
                                :key="s"
                                type="button"
                                class="username-suggestions__chip"
                                @click="applySuggestion(s)"
                            >@{{ s }}</button>
                        </div>
                    </div>
                </div>

                <!-- Row 2: Email + Mobile -->
                <div class="auth-form__row">
                    <AppInput
                        id="email"
                        v-model="form.email"
                        type="email"
                        label="Email address"
                        placeholder="you@example.com"
                        autocomplete="email"
                        required
                        :error="form.errors.email"
                    />

                    <AppInput
                        id="mobile"
                        v-model="form.mobile"
                        type="tel"
                        label="Mobile number"
                        placeholder="+1 555 000 0000"
                        autocomplete="tel"
                        :error="form.errors.mobile"
                    />
                </div>

                <!-- Row 3: Password + Confirm -->
                <div class="auth-form__row">
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
                </div>

                <!-- Full-width: terms + submit -->
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
