import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('', 'SuppliersController.index').as('index')
  Route.post('', 'SuppliersController.store').as('store')
  Route.get(':id', 'SuppliersController.show').as('show')
  Route.put(':id', 'SuppliersController.update').as('update')
  Route.delete(':id', 'SuppliersController.destroy').as('destroy')
  Route.patch(':id/activate', 'SuppliersController.activate').as('activate')
  Route.patch(':id/deactivate', 'SuppliersController.deactivate').as('deactivate')
})
  .prefix('api/v1/suppliers')
  .middleware('auth')
  .as('api.v1.suppliers')
