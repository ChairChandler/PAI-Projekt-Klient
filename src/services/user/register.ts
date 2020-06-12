import server_info from 'config/server.json'
import { Register } from 'models/user'
import PublicKeyService from 'services/public-key/public-key'
import encrypt from 'utils/encrypt'

class RegisterService {
    register = async (credentials: Register): Promise<{error?: string}> => {
        try {
            const publicKey = await PublicKeyService.getPublicKey()
            credentials.password =  encrypt(credentials.password, publicKey)

            const data = await fetch(`http://${server_info.ip}:${server_info.port}/user/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
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

export default new RegisterService()