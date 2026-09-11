import type { CubePattern } from '~~/lib/cube/cubesDefinition'

export function usePatternLabels() {
    const { t } = useI18n()

    function name(pattern: CubePattern): string {
        return pattern.name ?? (pattern.nameKey ? t(pattern.nameKey) : '')
    }

    function description(pattern: CubePattern): string {
        return pattern.description ?? (pattern.descriptionKey ? t(pattern.descriptionKey) : '')
    }

    return { name, description }
}
