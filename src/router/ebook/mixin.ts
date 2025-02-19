import { Catalog } from 'gede-book-entity'

export function buildNestedCatalogs<T extends Catalog>(catalogs: T[]): T[] {
    let catalogMap = new Map<number, T & { children: T[] }>()
    let nestedCatalogs: T[] = []
    catalogs.forEach(item => {
        catalogMap.set(item.id, { ...item, children: [] })
    })
    catalogs.forEach(item => {
        let currentItem = catalogMap.get(item.id)!
        if (item.parentId) {
            let parent = catalogMap.get(item.parentId)
            if (parent) {
                parent.children.push(currentItem)
            }
        } else {
            nestedCatalogs.push(currentItem)
        }
    })
    return nestedCatalogs
}