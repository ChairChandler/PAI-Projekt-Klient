import server_info from 'config/server.json'

export default async function isServerAvailable(): Promise<boolean> {
    try {
        await fetch(`http://${server_info.ip}:${server_info.port}`)
        return true
    } catch (err) {
        return false
    }
}