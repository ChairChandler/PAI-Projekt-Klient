import validationInfo from 'config/validation.json';

export function validateName(name: string): boolean {
    const { min, max } = validationInfo.tournament_name
    const length = name?.length
    return min <= length && length <= max
}

export function validateDescription(description: string): boolean {
    const { max } = validationInfo.description
    return description?.length <= max
}

export function validateDatetime(date: Date): boolean {
    if (date === undefined) {
        return false;
    }

    return isAfterCurrentDate(date)
}

export function validateParticipantsLimit(participantsAmount: number, limit?: number): boolean {
    if (participantsAmount === undefined) {
        return false;
    }

    return limit == null || limit >= participantsAmount
}

export function validateJoiningDeadline(date: Date, tournamentDate: Date): boolean {
    if (date === undefined || tournamentDate === undefined) {
        return false;
    }

    return isAfterCurrentDate(date) && isBeforeTournamentDay(date, tournamentDate)
}






function getOnlyDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function isAfterCurrentDate(date: Date): boolean {
    return getOnlyDate(new Date()).getTime() >= getOnlyDate(date).getTime()
}

function isBeforeTournamentDay(date: Date, tournamentDate: Date): boolean {
    return getOnlyDate(date).getTime() < getOnlyDate(tournamentDate).getTime()
}
