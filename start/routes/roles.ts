import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  Route.get('', 'RolesController.index').as('index')
  Route.post('', 'RolesController.store').as('store')
  Route.get(':slug', 'RolesController.show').as('show')
  Route.put(':slug', 'RolesController.update').as('update')

}).prefix('api/v1/roles').middleware('auth').as('api.v1.roles')