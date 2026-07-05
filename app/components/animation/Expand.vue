<template>
    <div
        class="expand-animation"
        :style="{ height: containerHeight }"
        :aria-hidden="!modelValue"
    >
        <div ref="contentRef">
            <slot name="default" />
        </div>
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    modelValue: boolean
    duration?: number
}>(), {
    duration: 300,
})

const contentRef = ref<HTMLElement | null>(null)
const contentHeight = ref(0)

let observer: ResizeObserver | null = null

const containerHeight = computed(() => (props.modelValue ? `${contentHeight.value}px` : '0px'))

function measure() {
    if (contentRef.value) {
        contentHeight.value = contentRef.value.scrollHeight
    }
}

onMounted(() => {
    measure()
    if (contentRef.value && typeof ResizeObserver !== 'undefined') {
        observer = new ResizeObserver(measure)
        observer.observe(contentRef.value)
    }
})

onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
})
</script>

<style scoped>
.expand-animation {
    overflow: hidden;
    transition: height v-bind('`${props.duration}ms`') ease;
}
</style>
