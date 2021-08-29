import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('', 'UsersController.index').as('index')
  Route.post('', 'UsersController.store').as('store')
  Route.get(':id', 'UsersController.show').as('show')
  Route.put(':id', 'UsersController.update').as('update')
  Route.delete(':id', 'UsersController.destroy').as('destroy')
  Route.patch(':id/activate', 'UsersController.activate').as('activate')
  Route.patch(':id/deactivate', 'UsersController.deactivate').as('deactivate')
  Route.get(':id/roles', 'UsersController.roles').as('permissions')
  Route.get(':id/permissions', 'UsersController.permissions').as('users')
})
  .prefix('api/v1/users')
  .middleware('auth')
  .as('api.v1.users')
