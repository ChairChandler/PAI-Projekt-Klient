import { TournamentInfo } from 'models/tournament'
import server_info from 'config/server.json'

export type TournamentShortInfo = { id: number, name: string, date: Date }

class TournamentService {
    retrieveClosestTournaments = async (): Promise<{ error?: string, data?: TournamentShortInfo[] }> => {
        try {
            const data = await fetch(`http://${server_info.ip}:${server_info.port}/tournament/list/general`)
            if (!data.ok) {
                return { error: 'Failed to retrieve upcoming tournaments' }
            }

            return { data: await data.json() }
        } catch (err) {
            return { error: err.message }
        }
    }

    retrieveTournamentInformation = async (tournament_id: number): Promise<{ error?: string, data?: TournamentInfo }> => {
        try {
            const data = await fetch(`http://${server_info.ip}:${server_info.port}/tournament/info?tournament_id=${tournament_id}`)
            if (!data.ok) {
                return { error: 'Failed to retrieve tourament informations' }
            }

            return { data: await data.json() }
        } catch (err) {
            return { error: err.message }
        }
    }

    modifyOrCreateTournamentInfo = async (payload: TournamentInfo, action: 'CREATE' | 'EDIT'): Promise<{ error?: string }> => {
        try {
            const data = await fetch(`http://${server_info.ip}:${server_info.port}/tournament/info`, {
                method: action === 'CREATE' ? 'POST' : 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!data.ok) {
                return { error: await data.text() }
            }

            return {}
        } catch (err) {
            return { error: err.message }
        }
    }
}

export default new TournamentService()