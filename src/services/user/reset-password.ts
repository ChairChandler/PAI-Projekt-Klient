import server_info from 'config/server.json'
import { ForgotPasswd } from 'models/user'

class ResetPasswordService {
    reset = async (credentials: ForgotPasswd): Promise<{error?: string}> => {
        try {
            const data = await fetch(`http://${server_info.ip}:${server_info.port}/user/login`, {
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

export default new ResetPasswordService()