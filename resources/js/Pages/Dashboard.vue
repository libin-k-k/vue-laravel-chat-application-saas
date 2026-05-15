<script src="./Dashboard.js"></script>

<template>
    <div class="dashboard">
        <header class="dashboard__header">
            <div class="dashboard__brand">
                <img src="/logo.png" alt="Logo" class="dashboard__logo-img" />
                <h1>{{ $page.props.appName ?? 'ChatApp' }}</h1>
            </div>
            <div class="dashboard__actions">
                <span class="dashboard__user">{{ user?.name }}</span>
                <button
                    type="button"
                    class="btn btn-secondary btn-sm"
                    :disabled="logoutForm.processing"
                    @click="logout"
                >
                    Log out
                </button>
            </div>
        </header>

        <main class="dashboard__main card">
            <div class="dashboard__welcome">
                <h2>Welcome, {{ user?.name }}!</h2>
                <p class="text-muted">You are signed in. Chat features are available at <a href="/chat" class="auth-link">/chat</a>.</p>
            </div>
        </main>
    </div>
</template>
