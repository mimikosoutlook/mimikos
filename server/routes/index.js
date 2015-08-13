import {Router} from 'express'
import auth from './auth'

const router = Router()

router.get('/', (req, res) => {
  res.render('index.jade', {page: 'home'})
})

router.get('/login', (req, res) => {
  res.render('login.jade', {title: 'Login', page: 'login'})
})

export default function setup (config) {
  router.use(auth(config))
  return router
}