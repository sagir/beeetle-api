import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('', 'ProductsController.index').as('index')
  Route.post('', 'ProductsController.store').as('store')
  Route.get(':slug', 'ProductsController.show').as('show')
  Route.put(':slug', 'ProductsController.update').as('update')
  Route.delete(':slug', 'ProductsController.destroy').as('destroy')
  Route.patch(':slug/activate', 'ProductsController.activate').as('activate')
  Route.patch(':slug/deactivate', 'ProductsController.deactivate').as('deactivate')
})
  .prefix('api/v1/products')
  .middleware('auth')
  .as('api.v1.products')
