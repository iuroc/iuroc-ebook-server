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
    hasChild?: boolean
}

export function addLevelsOld(catalogs: CatalogWithLevel[], parentId: number | null = null, level: number = 0): CatalogWithLevel[] {
    return catalogs
        .filter(catalog => catalog.parentId === parentId)
        .sort((a, b) => a.index - b.index) // 根据 index 排序
        .map(catalog => {
            const updatedCatalog = { ...catalog, level }
            // 递归处理该项的子项
            const children = addLevelsOld(catalogs, catalog.id, level + 1)
            // 返回当前项及其子项
            return [updatedCatalog, ...children]
        })
        .flat()
}

export function addLevels(catalogs: CatalogWithLevel[], parentId: number | null = null, level: number = 0): CatalogWithLevel[] {
    return catalogs
        .filter(catalog => catalog.parentId === parentId)
        .sort((a, b) => a.index - b.index) // 根据 index 排序
        .map(catalog => {
            const children = addLevels(catalogs, catalog.id, level + 1)
            const updatedCatalog = {
                ...catalog,
                level,
                hasChild: children.length > 0 // 判断是否有子项
            }
            // 返回当前项及其子项
            return [updatedCatalog, ...children]
        })
        .flat()
}
