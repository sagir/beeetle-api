import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('login', 'AuthController.login').as('login')
  Route.post('logout', 'AuthController.logout').as('logout')
}).as('api.v1.auth').prefix('api/v1')
