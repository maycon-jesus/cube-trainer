<script lang="ts" setup>
import { CollectionPage } from '~~/lib/jsonld/collectionPage';
import { toUseHeadGraph } from '~~/lib/jsonld/graph';
import { IdReference } from '~~/lib/jsonld/id';
import { ItemList } from '~~/lib/jsonld/itemList';
import { ListItem } from '~~/lib/jsonld/listItem';

const props = defineProps<{
    items: Array<{
        name: string,
        description: string,
        url: string
        imageUrl?: string
    }>
}>()

const getDomain = useGetDomain()
const localePath = useLocalePath()
const { t } = useI18n()

const data = computed(() => {
    const path = localePath("/patterns")
    const page = new CollectionPage()
        .id(getDomain(path, '/#collection'))
        .url(getDomain(path))
        .name(t('seo.patterns.title'))
        .description(t('seo.patterns.description'))
        .inLanguage(useGetCurrentLocale())
        .isPartOf(new IdReference(getDomain('/#website')))

    const itemList = new ItemList()
        .numberOfItems(props.items.length)
        .itemListElement(props.items.map((item, index) => {
            return new ListItem()
                .name(item.name)
                .name(item.description)
                .url(getDomain(localePath(item.url)))
                .image(getDomain(item.imageUrl))
                .position(index + 1)
        }))

    page.mainEntity(itemList)
    return [page]
})

useHead(toUseHeadGraph(data.value))
</script>