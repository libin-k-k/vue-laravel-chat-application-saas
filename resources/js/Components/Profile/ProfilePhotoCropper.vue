<script src="./ProfilePhotoCropper.js"></script>

<template>
    <div class="photo-cropper" role="dialog" aria-modal="true" aria-labelledby="photo-cropper-title">
        <div class="photo-cropper__backdrop" @click="cancel" />
        <div class="photo-cropper__panel">
            <header class="photo-cropper__header">
                <h2 id="photo-cropper-title" class="photo-cropper__title">Crop profile photo</h2>
                <p class="photo-cropper__subtitle">Adjust to a square (1:1) frame. Drag to reposition.</p>
            </header>

            <div class="photo-cropper__stage">
                <img ref="imageRef" :src="imageSrc" alt="Crop preview" class="photo-cropper__image" />
            </div>

            <footer class="photo-cropper__footer">
                <AppButton type="button" variant="secondary" size="md" @click="cancel">
                    Cancel
                </AppButton>
                <AppButton
                    type="button"
                    variant="primary"
                    size="md"
                    :loading="processing"
                    @click="confirm"
                >
                    {{ processing ? 'Saving…' : 'Use photo' }}
                </AppButton>
            </footer>
        </div>
    </div>
</template>

<style scoped>
.photo-cropper {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.photo-cropper__backdrop {
    position: absolute;
    inset: 0;
    background: var(--color-bg-overlay);
}

.photo-cropper__panel {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 420px;
    background: var(--color-bg-elevated);
    border-radius: 16px;
    border: 1px solid var(--color-border);
    box-shadow: 0 24px 48px var(--color-shadow-strong);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.photo-cropper__header {
    padding: 1.25rem 1.25rem 0.75rem;
}

.photo-cropper__title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-text);
}

.photo-cropper__subtitle {
    margin: 0.25rem 0 0;
    font-size: 0.8125rem;
    color: var(--color-text-secondary);
}

.photo-cropper__stage {
    width: 100%;
    height: 320px;
    background: #111827;
    overflow: hidden;
}

.photo-cropper__image {
    display: block;
    max-width: 100%;
}

.photo-cropper__footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1rem 1.25rem 1.25rem;
    border-top: 1px solid var(--color-border-secondary);
}
</style>
