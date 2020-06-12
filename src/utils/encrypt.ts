import crypto from 'crypto'

export default function encrypt(val: string, publicKey: string) {
    const buffer = Buffer.from(val, 'utf8')
    const encrypted = crypto.publicEncrypt(publicKey, buffer)
    return encrypted.toString('base64')
}