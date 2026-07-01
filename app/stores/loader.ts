export const useLoader = defineStore('loader', () => {
    const counter = useState('loader-counter', () => 0)

    const start = () => {
        counter.value++
    }
    const end = () => {
        counter.value--
    }

    const loading = computed(() => counter.value > 0)

    return {
        counter, start, end, loading
    }
})