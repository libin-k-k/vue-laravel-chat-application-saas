<script setup>
defineProps({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        default: '',
    },
});
</script>

<template>
    <div class="auth-card card">
        <div class="auth-card__header">
            <h1 class="auth-card__title">{{ title }}</h1>
            <p v-if="subtitle" class="auth-card__subtitle">{{ subtitle }}</p>
        </div>

        <div class="auth-card__body">
            <slot />
        </div>
    </div>
</template>

<style scoped>
.auth-card {
    width: 100%;
    padding: 0;
    overflow: hidden;
}

.auth-card__header {
    padding: 1.75rem 1.75rem 0;
    text-align: center;
}

.auth-card__title {
    margin: 0 0 0.375rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-text);
}

.auth-card__subtitle {
    margin: 0;
    font-size: 0.9375rem;
    color: var(--color-text-secondary);
}

.auth-card__body {
    padding: 1.5rem 1.75rem 1.75rem;
}
</style>
