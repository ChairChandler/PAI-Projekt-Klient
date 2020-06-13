export function getOnlyDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function getOnlyDateString(date: Date): string {
    let day: string | number = date.getDate()
    let month: string | number = date.getMonth() + 1
    if (day < 10) {
        day = `0${day}`
    }
    if (month < 10) {
        month = `0${month}`
    }
    return `${date.getFullYear()}-${month}-${date.getDate()}`
}

export function oneDayAfterNowDate(): Date {
    const date = new Date()
    date.setDate(date.getDate() + 1)
    return date
}