import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('', 'UserController.index').as('index')
  Route.post('', 'UserController.store').as('store')
  Route.get(':slug', 'UserController.show').as('show')
  Route.put(':slug', 'UserController.update').as('update')
  Route.delete(':slug', 'UserController.destroy').as('destroy')
  Route.patch(':slug/activate', 'UserController.activate').as('activate')
  Route.patch(':slug/deactivate', 'UserController.deactivate').as('deactivate')
  Route.get(':slug/roles', 'UserController.roles').as('permissions')
  Route.get(':slug/permissions', 'UserController.permissions').as('users')
})
  .prefix('api/v1/users')
  .middleware('auth')
  .as('api.v1.users')
