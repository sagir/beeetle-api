import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('', 'ProductsController.index').as('index')
  Route.get('inactive', 'ProductsController.inactive').as('index.inactive')
  Route.post('', 'ProductsController.store').as('store')
  Route.get(':slug', 'ProductsController.show').as('show')

  Route.put(':slug/categories', 'ProductsController.updateCategories').as('categories.update')
  Route.put(':slug/specifications', 'ProductsController.updateSpecifications').as(
    'specifications.update'
  )

  Route.put(':slug', 'ProductsController.update').as('update')
  Route.delete(':slug', 'ProductsController.destroy').as('destroy')
  Route.patch(':slug/activate', 'ProductsController.activate').as('activate')
  Route.patch(':slug/deactivate', 'ProductsController.deactivate').as('deactivate')
})
  .prefix('api/v1/products')
  .middleware('auth')
  .as('api.v1.products')
