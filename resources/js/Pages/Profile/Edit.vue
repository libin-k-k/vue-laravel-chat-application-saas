<script src="./Edit.js"></script>

<template>
    <div class="profile-page">
        <ProfilePhotoCropper
            v-if="showCropper && cropSrc"
            :image-src="cropSrc"
            @confirm="onCropConfirm"
            @cancel="closeCropper"
        />

        <PrivacyPrivateModal
            v-if="showPrivateModal"
            @confirm="confirmPrivateProfile"
            @cancel="cancelPrivateProfile"
        />

        <header class="profile-page__topbar">
            <Link :href="route('chat')" class="profile-page__back" aria-label="Back to chat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </Link>
            <h1 class="profile-page__heading">Profile settings</h1>
            <span class="profile-page__topbar-spacer" />
        </header>

        <div class="profile-page__content">
            <div v-if="statusMessage()" class="profile-page__alert profile-page__alert--success">
                <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
                </svg>
                {{ statusMessage() }}
            </div>

            <nav class="profile-tabs" aria-label="Profile settings sections">
                <button
                    type="button"
                    class="profile-tabs__btn"
                    :class="{ 'profile-tabs__btn--active': activeTab === 'profile' }"
                    @click="activeTab = 'profile'"
                >
                    Profile
                </button>
                <button
                    type="button"
                    class="profile-tabs__btn"
                    :class="{ 'profile-tabs__btn--active': activeTab === 'privacy' }"
                    @click="activeTab = 'privacy'"
                >
                    Privacy
                </button>
            </nav>

            <form v-show="activeTab === 'profile'" class="profile-card" @submit.prevent="submit" novalidate>
                <section class="profile-card__section profile-card__section--photo">
                    <div class="profile-photo">
                        <div ref="avatarRef" class="profile-photo__wrap">
                            <button
                                type="button"
                                class="profile-photo__trigger"
                                :aria-expanded="photoMenuOpen"
                                aria-haspopup="menu"
                                @click.stop="togglePhotoMenu"
                            >
                                <img
                                    v-if="photoPreview"
                                    :src="photoPreview"
                                    alt="Profile"
                                    class="profile-photo__img"
                                />
                                <span v-else class="profile-photo__letter">
                                    {{ form.name ? form.name.charAt(0).toUpperCase() : '?' }}
                                </span>
                                <span class="profile-photo__overlay" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 16v-8m0 0l-3 3m3-3l3 3" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </span>
                            </button>

                            <input
                                ref="fileInput"
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                class="profile-photo__file"
                                tabindex="-1"
                                @change="onPhotoSelected"
                            />

                            <div
                                v-if="photoMenuOpen"
                                ref="photoMenuRef"
                                class="profile-photo__menu"
                                role="menu"
                                @click.stop
                            >
                                <button
                                    type="button"
                                    class="profile-photo__menu-item"
                                    role="menuitem"
                                    @click="triggerUpdate"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                                        <path d="M12 16v-8m0 0l-3 3m3-3l3 3" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    Update
                                </button>
                                <button
                                    v-if="hasPhoto"
                                    type="button"
                                    class="profile-photo__menu-item profile-photo__menu-item--danger"
                                    role="menuitem"
                                    @click="removePhoto"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <line x1="10" y1="11" x2="10" y2="17" stroke-linecap="round"/>
                                        <line x1="14" y1="11" x2="14" y2="17" stroke-linecap="round"/>
                                    </svg>
                                    Remove
                                </button>
                            </div>
                        </div>

                        <p v-if="form.errors.profile_photo" class="profile-field__error profile-photo__error">
                            {{ form.errors.profile_photo }}
                        </p>
                    </div>
                </section>

                <section class="profile-card__section">
                    <div class="profile-fields">
                        <div class="profile-field">
                            <label class="profile-field__label" for="profile-name">
                                Full name <span class="profile-required">*</span>
                            </label>
                            <input
                                id="profile-name"
                                v-model="form.name"
                                type="text"
                                class="profile-field__input"
                                :class="{ 'profile-field__input--error': form.errors.name }"
                                placeholder="Your full name"
                                autocomplete="name"
                                required
                            />
                            <p v-if="form.errors.name" class="profile-field__error">{{ form.errors.name }}</p>
                        </div>

                        <div class="profile-field">
                            <label class="profile-field__label" for="profile-username">
                                Username <span class="profile-required">*</span>
                            </label>
                            <div class="username-field__wrap">
                                <span class="username-field__prefix">@</span>
                                <input
                                    id="profile-username"
                                    v-model="form.username"
                                    type="text"
                                    class="form-input username-field__input profile-field__input--username"
                                    :class="{
                                        'form-input--error': form.errors.username || usernameError || usernameStatus === 'invalid' || usernameStatus === 'taken',
                                        'form-input--success': usernameStatus === 'available' || usernameStatus === 'current',
                                    }"
                                    placeholder="john_doe"
                                    autocomplete="username"
                                    spellcheck="false"
                                    required
                                    @input="form.username = form.username.toLowerCase()"
                                />
                                <span class="username-field__status-icon">
                                    <svg v-if="usernameStatus === 'checking'" class="username-status-icon username-status-icon--spin" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="40 20"/>
                                    </svg>
                                    <svg v-else-if="usernameStatus === 'available' || usernameStatus === 'current'" class="username-status-icon username-status-icon--available" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                    <svg v-else-if="usernameStatus === 'taken' || usernameStatus === 'invalid'" class="username-status-icon username-status-icon--taken" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                    </svg>
                                </span>
                            </div>
                            <p v-if="form.errors.username" class="profile-field__error">{{ form.errors.username }}</p>
                            <p v-else-if="usernameError" class="profile-field__error">{{ usernameError }}</p>
                            <p
                                v-else-if="usernameMessage"
                                class="auth-field__status-msg"
                                :class="{
                                    'auth-field__status-msg--available': usernameStatus === 'available' || usernameStatus === 'current',
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
                                    @click="pickSuggestion(s)"
                                >
                                    @{{ s }}
                                </button>
                            </div>
                        </div>

                        <div class="profile-field">
                            <label class="profile-field__label" for="profile-email">
                                Email address <span class="profile-required">*</span>
                            </label>
                            <input
                                id="profile-email"
                                v-model="form.email"
                                type="email"
                                class="profile-field__input"
                                :class="{ 'profile-field__input--error': form.errors.email }"
                                placeholder="you@example.com"
                                autocomplete="email"
                                required
                            />
                            <p v-if="form.errors.email" class="profile-field__error">{{ form.errors.email }}</p>
                            <p v-else class="profile-field__hint">Changing email signs you out and requires verification.</p>
                        </div>

                        <div class="profile-field">
                            <label class="profile-field__label" for="profile-mobile">Mobile</label>
                            <input
                                id="profile-mobile"
                                v-model="form.mobile"
                                type="tel"
                                class="profile-field__input"
                                :class="{ 'profile-field__input--error': form.errors.mobile }"
                                placeholder="Optional"
                                autocomplete="tel"
                            />
                            <p v-if="form.errors.mobile" class="profile-field__error">{{ form.errors.mobile }}</p>
                        </div>
                    </div>
                </section>

                <footer class="profile-card__footer">
                    <AppButton
                        type="submit"
                        variant="primary"
                        size="lg"
                        :loading="form.processing"
                        :block="true"
                    >
                        {{ form.processing ? 'Saving…' : 'Save changes' }}
                    </AppButton>
                    <Link :href="route('chat')" class="profile-card__cancel">Cancel</Link>
                </footer>
            </form>

            <form v-show="activeTab === 'privacy'" class="profile-card" @submit.prevent="savePrivacy" novalidate>
                <section class="profile-card__section">
                    <div class="privacy-setting privacy-setting--visibility">
                        <div class="privacy-setting__info">
                            <span class="privacy-setting__label">Profile visibility</span>
                            <span class="privacy-setting__desc">Choose who can discover your profile</span>
                        </div>
                        <div class="privacy-segment" role="group" aria-label="Profile visibility">
                            <button
                                type="button"
                                class="privacy-segment__btn"
                                :class="{ 'privacy-segment__btn--active': !privacyForm.is_private_profile }"
                                @click="setPublicProfile"
                            >
                                Public
                            </button>
                            <button
                                type="button"
                                class="privacy-segment__btn"
                                :class="{ 'privacy-segment__btn--active': privacyForm.is_private_profile }"
                                @click="tryPrivateProfile"
                            >
                                Private
                            </button>
                        </div>
                    </div>
                </section>

                <section class="profile-card__section">
                    <div class="privacy-setting">
                        <div class="privacy-setting__info">
                            <span class="privacy-setting__label">Show online status</span>
                            <span class="privacy-setting__desc">Let others see when you are online</span>
                        </div>
                        <AppToggle v-model="privacyForm.show_online_status" />
                    </div>

                    <div class="privacy-setting">
                        <div class="privacy-setting__info">
                            <span class="privacy-setting__label">Show profile image</span>
                            <span class="privacy-setting__desc">Display your photo to other users</span>
                        </div>
                        <AppToggle v-model="privacyForm.show_profile_image" />
                    </div>

                    <div class="privacy-setting">
                        <div class="privacy-setting__info">
                            <span class="privacy-setting__label">Show email address</span>
                            <span class="privacy-setting__desc">Visible on your public profile</span>
                        </div>
                        <AppToggle v-model="privacyForm.show_email" />
                    </div>

                    <div class="privacy-setting">
                        <div class="privacy-setting__info">
                            <span class="privacy-setting__label">Show mobile number</span>
                            <span class="privacy-setting__desc">Visible on your public profile</span>
                        </div>
                        <AppToggle v-model="privacyForm.show_mobile" />
                    </div>
                </section>

                <footer class="profile-card__footer">
                    <AppButton
                        type="submit"
                        variant="primary"
                        size="lg"
                        :loading="privacyForm.processing"
                        :block="true"
                    >
                        {{ privacyForm.processing ? 'Saving…' : 'Save privacy settings' }}
                    </AppButton>
                </footer>
            </form>
        </div>
    </div>
</template>
