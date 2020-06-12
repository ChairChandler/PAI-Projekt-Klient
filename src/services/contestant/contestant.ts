import server_info from 'config/server.json'
import { ContestantInfo, TournamentInfo } from 'models/tournament'
import LoginService from 'services/user/login'

class ContestantService {
    join = async (payload: ContestantInfo): Promise<{ error?: string }> => {
        if (!LoginService.isAccountLoggedIn()) {
            return { error: 'account not logged in' }
        }

        try {
            const data = await fetch(`http://${server_info.ip}:${server_info.port}/tournament/contestants`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!data.ok) {
                return { error: await data.text() }
            }
        } catch (err) {
            return { error: err.message }
        }
    }

    isContestant = async (tournament_id: number): Promise<{ error?: string, contestant?: boolean }> => {
        try {
            const data = await fetch(`http://${server_info.ip}:${server_info.port}/tournament/contestants?tournament_id=${tournament_id}`, {
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            })

            if (!data.ok) {
                return { error: await data.text() }
            }

            const json = await data.json()
            return { contestant: json.taking_part }
        } catch (err) {
            return { error: err.message }
        }
    }

    retrieveContestantTournaments = async (): Promise<{ error?: string, data?: TournamentInfo[] }> => {
        try {
            const data = await fetch(`http://${server_info.ip}:${server_info.port}/tournament/list/contestant`, {
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            })

            if (!data.ok) {
                return { error: 'Failed to retrieve contestant touraments list' }
            }

            return { data: await data.json() }
        } catch (err) {
            return { error: err.message }
        }
    }
}

export default new ContestantService()