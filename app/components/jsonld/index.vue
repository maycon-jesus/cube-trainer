<script setup lang="ts">
import { IdReference } from "~~/lib/jsonld/id"
import { Offer } from "~~/lib/jsonld/offer"
import { Person } from "~~/lib/jsonld/person"
import { WebApplication } from "~~/lib/jsonld/webApplication"
import { WebSite } from "~~/lib/jsonld/webSite"
import { toUseHeadGraph } from "~~/lib/jsonld/graph"

const { t, tm, rt } = useI18n()
const getDomain = useGetDomain()
const runtimeConfig = useRuntimeConfig()

const data = computed(() => {
    const owner = new Person()
        .id(getDomain("/#owner"))
        .name("Maycon Jesus")
        .url("https://github.com/maycon-jesus")

    const webApp = new WebApplication()
        .id(getDomain("/#webapp"))
        .url(getDomain("/"))
        .name("Cube Trainer")
        .description(t('seo.index.description'))
        .applicationCategory("UtilitiesApplication")
        .operatingSystem("Any")
        .browserRequirements("Requires JavaScript")
        .softwareVersion(runtimeConfig.public.version)
        .image(getDomain('/og.png'))
        .inLanguage(useGetCurrentLocale())
        .isAccessibleForFree(false)
        .featureList((tm('jsonld.index.featureList') as unknown[]).map(item => rt(item as string)))
        .creator(new IdReference(getDomain("/#owner")))
        .offers(new Offer().price("0").priceCurrency("USD"))

    const website = new WebSite()
        .url(getDomain("/"))
        .id(getDomain("/#website"))
        .name("Cube Trainer")
        .description(t('seo.index.description'))
        .owner(new IdReference(getDomain("/#owner")))
        .inLanguage(useGetCurrentLocale())
        .mainEntity(new IdReference(getDomain("/#webapp")))
    return [website, webApp, owner]
})

useHead(toUseHeadGraph(data.value))
</script>