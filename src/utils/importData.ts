interface MastodonData {
    orderedItems: Array<{
        object: {
            content: string
        }
    }>
}
// 导入Mastodon
export const parseMastodonData = (data: MastodonData) => {
    const memos: string[] = data.orderedItems.map(item => item.object.content).filter(content => content).map(content => {
        // 去掉p标签
        return content.replace(/<br \/>/g, '\n').replace(/<p>/g, '').replace(/<\/p>/g, '')
    })
    return memos
}

 