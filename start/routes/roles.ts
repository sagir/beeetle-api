import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  Route.get('', 'RolesController.index').as('index')
  Route.post('', 'RolesController.store').as('store')

}).prefix('api/v1/roles').middleware('auth').as('api.v1.roles')
