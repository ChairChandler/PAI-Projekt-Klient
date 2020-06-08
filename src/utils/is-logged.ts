import Cookies from 'js-cookie'

export default () => 'token-max-age' in Cookies.getJSON()
