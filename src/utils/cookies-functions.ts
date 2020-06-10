import Cookies from 'js-cookie'

export  function isLogged() {
    return 'token-max-age' in Cookies.getJSON()
}

export function isPerson(id: number) {
    return getSelfID() === id
}

export function getSelfID() {
    return Number.parseInt(Cookies.get('id'))
}