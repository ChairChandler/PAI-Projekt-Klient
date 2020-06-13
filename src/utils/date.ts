export function getOnlyDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function getOnlyDateString(date: Date): string {
    return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`
}