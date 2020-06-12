import server_info from 'config/server.json'
import { Login } from 'models/user'
import Cookies from 'js-cookie'
import Schedule from 'node-schedule'
import Subject from 'utils/subject'
import PublicKeyService from 'services/public-key/public-key'
import encrypt from 'utils/encrypt'

export type LoginSubject = { error?: string, isLogged?: boolean }

class LoginService {
    private isLogged: boolean
    private logoutTask: Schedule.Job
    readonly subject = new Subject<LoginSubject>()

    constructor() {
        const cookies = Cookies.getJSON()
        this.isLogged = 'id' in cookies
        if (this.isLogged) {
            this.subject.notify({ isLogged: true })
            this.createLogoutJob()
        }
    }

    private createLogoutJob = () => {
        const date = Cookies.get('token-expire-date')
        if (date) {
            const expireDate = new Date(date)
            this.logoutTask = Schedule.scheduleJob(expireDate, async () => {
                await this.logout()
            })
        }
    }

    login = async (credentials: Login): Promise<LoginSubject> => {
        let res: LoginSubject
        try {
            const publicKey = await PublicKeyService.getPublicKey()
            credentials.password =  encrypt(credentials.password, publicKey)
            
            const data = await fetch(`http://${server_info.ip}:${server_info.port}/user/login`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            })

            if (!data.ok) {
                res = { error: await data.text() }
            } else {
                this.isLogged = true
                this.logoutTask?.cancel()
                this.createLogoutJob()
                res = { isLogged: true }
            }
        } catch (err) {
            res = { error: err.message }
        } finally {
            this.subject.notify(res)
            return res
        }
    }

    logout = async (): Promise<LoginSubject> => {
        let res: LoginSubject
        try {
            const data = await fetch(`http://${server_info.ip}:${server_info.port}/user/login`, {
                method: 'DELETE',
                credentials: 'include'
            })

            if (!data.ok) {
                res = { error: await data.text() }
            } else {
                this.isLogged = false
                this.logoutTask?.cancel()
                res = { isLogged: false }
            }
        } catch (err) {
            res = { error: err.message }
        } finally {
            this.subject.notify(res)
            return res
        }
    }

    isAccountLoggedIn = () => this.isLogged
    isPerson = (id: number) => this.getSelfID() === id
    getSelfID = () => Number.parseInt(Cookies.get('id'))
}

export default new LoginService()