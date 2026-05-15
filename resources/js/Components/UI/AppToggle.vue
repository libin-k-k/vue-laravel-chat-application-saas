<script src="./AppToggle.js"></script>

<template>
    <button
        :id="id"
        type="button"
        role="switch"
        class="app-toggle"
        :class="{ 'app-toggle--on': checked, 'app-toggle--disabled': disabled }"
        :aria-checked="checked"
        :disabled="disabled"
        @click="checked = !checked"
    >
        <span class="app-toggle__track">
            <span class="app-toggle__thumb" />
        </span>
    </button>
</template>
