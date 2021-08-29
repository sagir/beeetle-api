import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  Route.get('', 'RolesController.index').as('index')
  Route.post('', 'RolesController.store').as('store')
  Route.get(':slug', 'RolesController.show').as('show')
  Route.put(':slug', 'RolesController.update').as('update')
  Route.delete(':slug', 'RolesController.destroy').as('destroy')
  Route.patch(':slug/activate', 'RolesController.activate').as('activate')
  Route.patch(':slug/deactivate', 'RolesController.deactivate').as('deactivate')
  Route.get(':slug/permissions', 'RolesController.permissions').as('permissions')

}).prefix('api/v1/roles').middleware('auth').as('api.v1.roles')
