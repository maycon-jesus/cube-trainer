<script lang="ts" setup>
import type { CubePattern } from '~~/lib/cube/cubesDefinition';
import { CollectionPage } from '~~/lib/jsonld/collectionPage';
import { toUseHeadGraph } from '~~/lib/jsonld/graph';
import { IdReference } from '~~/lib/jsonld/id';
import { ItemList } from '~~/lib/jsonld/itemList';
import { ListItem } from '~~/lib/jsonld/listItem';

const props = defineProps<{
    puzzleId: string
    patterns: CubePattern[]
}>()

const getDomain = useGetDomain()
const getAbsoluteUrl = useGetAbsoluteUrl()
const { t } = useI18n()

const data = computed(() => {
    const path = `/patterns/${props.puzzleId}`
    const page = new CollectionPage()
        .id(getDomain(path, '#collection'))
        .url(getDomain(path))
        .name(t(`seo.patterns.puzzles.${props.puzzleId}.title`))
        .description(t(`seo.patterns.puzzles.${props.puzzleId}.description`))
        .inLanguage(useGetCurrentLocale())
        .isPartOf(new IdReference(getDomain('/patterns', '#collection')))

    const itemList = new ItemList()
        .numberOfItems(props.patterns.length)
        .itemListElement(props.patterns.map((pattern, index) => {
            return new ListItem()
                .name(pattern.name)
                .description(pattern.description)
                .image(getAbsoluteUrl(pattern.imageUrl))
                .position(index + 1)
        }))

    page.mainEntity(itemList)
    return [page]
})

useHead(toUseHeadGraph(data.value))
</script>