<script src="./AppInput.js"></script>

<template>
    <div class="app-input-wrap">
        <label v-if="label" :for="id" class="form-label">{{ label }}</label>

        <div class="app-input__field-wrap">
            <slot name="prefix" />
            <input
                v-bind="$attrs"
                :id="id"
                :value="modelValue"
                class="form-input"
                :class="{ 'form-input--error': error }"
                @input="$emit('update:modelValue', $event.target.value)"
            />
            <slot name="suffix" />
        </div>

        <p v-if="error" class="app-input__error">{{ error }}</p>
        <p v-else-if="hint" class="app-input__hint">{{ hint }}</p>
    </div>
</template>
