export const useLayoutStateStore = defineStore('layoutState', () => {
    const drawerOpen = ref(true)

    watch(useDisplay().mobile, (isMobile) => {
        if (isMobile) {
            drawerOpen.value = false
        } else {
            drawerOpen.value = true
        }
    }, { immediate: true })

    return { drawerOpen }
})