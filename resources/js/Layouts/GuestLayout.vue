<script src="./GuestLayout.js"></script>

<template>
    <Head :title="title" />

    <div class="auth-layout">
        <!-- Left brand panel (desktop only) -->
        <div class="auth-layout__brand" aria-hidden="true">
            <div class="auth-layout__brand-glow" />

            <div class="auth-layout__brand-content">
                <div class="auth-layout__logo">
                    <img src="/logo.png" :alt="appName" class="auth-layout__logo-img" />
                </div>
                <h1 class="auth-layout__brand-title">{{ appName }}</h1>
                <p class="auth-layout__brand-tagline">
                    Connect, collaborate and chat with your team in real time.
                </p>
                <ul class="auth-layout__features">
                    <li><span class="auth-layout__feature-dot" />End-to-end encrypted messages</li>
                    <li><span class="auth-layout__feature-dot" />Real-time delivery &amp; read receipts</li>
                    <li><span class="auth-layout__feature-dot" />File sharing &amp; media support</li>
                </ul>
            </div>

            <div class="auth-layout__brand-circles" aria-hidden="true">
                <span class="auth-layout__circle auth-layout__circle--1" />
                <span class="auth-layout__circle auth-layout__circle--2" />
                <span class="auth-layout__circle auth-layout__circle--3" />
            </div>
        </div>

        <!-- Right form panel -->
        <div class="auth-layout__form-panel">
            <div class="auth-layout__form-top">
                <a href="/" class="auth-layout__form-logo">
                    <img src="/logo.png" :alt="appName" class="auth-layout__form-logo-img" />
                    <span class="auth-layout__form-logo-text">{{ appName }}</span>
                </a>
                <ThemeToggle />
            </div>

            <div class="auth-layout__form-body">
                <slot />
            </div>

            <p class="auth-layout__form-footer">
                &copy; {{ year }} {{ appName }}. All rights reserved.
            </p>
        </div>
    </div>
</template>
