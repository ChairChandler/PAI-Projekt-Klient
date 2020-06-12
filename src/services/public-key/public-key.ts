import server_info from 'config/server.json'

class PublicKeyService {
    getPublicKey = async (): Promise<string> => {
        try {
            const data = await fetch(`http://${server_info.ip}:${server_info.port}/public-key`)
            if (!data.ok) {
                console.error('cannot retrieve public key')
            } else {
                const json = await data.json()
                return json["publicKey"]
            }
        } catch (err) {
            console.error(err.message)
        }
    }
}

export default new PublicKeyService()