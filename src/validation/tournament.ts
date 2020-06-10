export function validateTournamentName(name: string): boolean {
    if (name === undefined) {
        return false;
    }

    return 8 <= name.length && name.length <= 24
}

export function validateDescription(name: string): boolean {
    if (name === undefined) {
        return false;
    }

    return name.length <= 255
}

export function validateDatetime(date: Date): boolean {
    if (date === undefined) {
        return false;
    }

    return isAfterCurrentDate(date)
}

export function validateParticipantsLimit(participantsAmount: number, limit?: number): boolean {
    if(participantsAmount === undefined) {
        return false;
    }
    
    return limit == null || limit >= participantsAmount
}

export function validateJoiningDeadline(date: Date, tournamentDate: Date): boolean {
    if (date === undefined) {
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
