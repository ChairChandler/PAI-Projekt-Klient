import server_info from 'config/server.json'
import { ContestantInfo } from 'models/tournament'
import LoginService from 'services/user/login'

class JoinTournamentService {
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
}

export default new JoinTournamentService()