<script src="./AppButton.js"></script>

<template>
    <button
        :type="type"
        class="btn"
        :class="[
            `btn-${variant}`,
            `btn-${size}`,
            { 'btn--block': block, 'btn--loading': loading }
        ]"
        :disabled="loading || $attrs.disabled"
        v-bind="$attrs"
    >
        <span v-if="loading" class="btn__spinner" aria-hidden="true" />
        <slot />
    </button>
</template>
