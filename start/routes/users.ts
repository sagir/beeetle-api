import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('', 'UsersController.index').as('index')
  Route.post('', 'UsersController.store').as('store')
  Route.get(':slug', 'UsersController.show').as('show')
  Route.put(':slug', 'UsersController.update').as('update')
  Route.delete(':slug', 'UsersController.destroy').as('destroy')
  Route.patch(':slug/activate', 'UsersController.activate').as('activate')
  Route.patch(':slug/deactivate', 'UsersController.deactivate').as('deactivate')
  Route.get(':slug/roles', 'UsersController.roles').as('permissions')
  Route.get(':slug/permissions', 'UsersController.permissions').as('users')
})
  .prefix('api/v1/users')
  .middleware('auth')
  .as('api.v1.users')
