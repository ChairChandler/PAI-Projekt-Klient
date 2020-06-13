import validationInfo from 'config/validation.json';
import { getOnlyDate } from 'utils/date'

export function validateName(name: string): boolean {
    const { min, max } = validationInfo.tournament_name
    const length = name?.length
    return min <= length && length <= max
}

export function validateDescription(description: string): boolean {
    const { max } = validationInfo.description
    return description?.length <= max
}

export function validateDatetime(date: Date, deadline: Date): boolean {
    if (date === undefined) {
        return false;
    }
    
    return isAfterCurrentDate(date) && isBeforeTournamentDay(deadline, date)
}

export function validateParticipantsLimit(limit: number, participantsAmount: number|null): boolean {
    return limit === Infinity || participantsAmount == null || limit >= participantsAmount
}

export function validateJoiningDeadline(date: Date, tournamentDate: Date): boolean {
    if (date === undefined || tournamentDate === undefined) {
        return false;
    }

    return isAfterCurrentDate(date) && isBeforeTournamentDay(date, tournamentDate)
}







function isAfterCurrentDate(date: Date): boolean {
    return getOnlyDate(new Date()).getTime() < getOnlyDate(date).getTime()
}

function isBeforeTournamentDay(date: Date, tournamentDate: Date): boolean {
    return getOnlyDate(date).getTime() < getOnlyDate(tournamentDate).getTime()
}
