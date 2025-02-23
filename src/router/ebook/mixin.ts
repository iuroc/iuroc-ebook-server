import { Catalog } from 'gede-book-entity'

export function buildNestedCatalogs<T extends Catalog>(catalogs: T[]): T[] {
    let catalogMap = new Map<number, T & { childrens: T[] }>()
    let nestedCatalogs: T[] = []
    catalogs.forEach(item => {
        catalogMap.set(item.id, { ...item, childrens: [] })
    })
    catalogs.forEach(item => {
        let currentItem = catalogMap.get(item.id)!
        if (item.parentId) {
            let parent = catalogMap.get(item.parentId)
            if (parent) {
                parent.childrens.push(currentItem)
            }
        } else {
            nestedCatalogs.push(currentItem)
        }
    })
    return nestedCatalogs
}

export interface CatalogWithLevel {
    id: number
    page: number
    title: string
    parentId: number | null
    index: number
    level?: number
}


export function addLevels(catalogs: CatalogWithLevel[], parentId: number | null = null, level: number = 0): CatalogWithLevel[] {
    return catalogs
        .filter(catalog => catalog.parentId === parentId)
        .map(catalog => {
            const updatedCatalog = { ...catalog, level }
            const children = addLevels(catalogs, catalog.id, level + 1)
            return [updatedCatalog, ...children]
        })
        .flat()
}