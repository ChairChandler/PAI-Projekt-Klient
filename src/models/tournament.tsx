export class TournamentInfo {
    constructor(
        public tournament_id?: number,
        public tournament_name?: string,
        public owner_id?: number,
        public description?: string | null,
        public organizer?: string,
        public datetime?: Date,
        public localization_lat?: number, //latitude
        public localization_lng?: number, //longitude
        public participants_limit?: number | null,
        public joining_deadline?: Date,
        public current_contestants_amount?: number,
        public logos?: { id?: number, data?: string }[],
        public finished?: boolean,
        public started?: boolean
    ) { }
}

export class ContestantInfo {
    constructor(
        public tournament_id: number,
        public license_id: string,
        public ranking_pos: number
    ) { }
}

export class LadderInfo {
    constructor(
        public lastNode: number,
        public contestants: { id: number, name: string, node_id: number, defeated: boolean | null }[] //node_id min 0
    ) { }
}

export class ContestantDecision {
    constructor(
        public tournament_id: number,
        public user_id: number,
        public winner: boolean
    ) { }
}