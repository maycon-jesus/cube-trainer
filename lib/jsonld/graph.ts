import type { JsonLdBase } from "./base";

/**
 * Gera o `<script type="application/ld+json">` com um `@graph` contendo os nós
 * informados como itens de topo. Referências (`IdReference`) entre eles só
 * funcionam se o nó referenciado estiver presente aqui.
 */
export function toUseHeadGraph(nodes: JsonLdBase[]) {
    const json = {
        "@context": "https://schema.org",
        "@graph": nodes.map(node => node.toJson()),
    }
    return {
        script: [
            {
                type: 'application/ld+json' as const,
                key: 'jsonld',
                innerHTML: JSON.stringify(json),
            }
        ],
    }
}
