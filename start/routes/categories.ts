import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('', 'CategoriesController.index').as('index')
  Route.post('', 'CategoriesController.store').as('store')
  Route.get(':slug', 'CategoriesController.show').as('show')
  Route.put(':slug', 'CategoriesController.update').as('update')
  Route.delete(':slug', 'CategoriesController.destroy').as('destroy')
  Route.patch(':slug/activate', 'CategoriesController.activate').as('activate')
  Route.patch(':slug/deactivate', 'CategoriesController.deactivate').as('deactivate')
})
  .prefix('api/v1/categories')
  .middleware('auth')
  .as('api.v1.categories')
