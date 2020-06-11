import server_info from 'config/server.json'
import { Register } from 'models/user'

class RegisterService {
    register = async (credentials: Register): Promise<{error?: string}> => {
        try {
            const data = await fetch(`http://${server_info.ip}:${server_info.port}/user/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            })

            if (!data.ok) {
                return { error: await data.text() }
            }
        } catch (err) {
            return { error: err.message }
        }
    }
}

export default new RegisterService()