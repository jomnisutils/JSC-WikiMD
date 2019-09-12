export function isAnchor(href: string): boolean {
    return href.startsWith(`${location.href}#`)
}
