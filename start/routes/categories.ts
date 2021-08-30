import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('', 'CategoriesController.index').as('index').middleware('auth')
  Route.get('list', 'CategoriesController.list').as('list')
  Route.post('', 'CategoriesController.store').as('store').middleware('auth')
  Route.get(':slug', 'CategoriesController.show').as('show').middleware('auth')
  Route.put(':slug', 'CategoriesController.update').as('update').middleware('auth')
  Route.delete(':slug', 'CategoriesController.destroy').as('destroy').middleware('auth')
  Route.patch(':slug/activate', 'CategoriesController.activate').as('activate').middleware('auth')

  Route.patch(':slug/deactivate', 'CategoriesController.deactivate')
    .as('deactivate')
    .middleware('auth')
})
  .prefix('api/v1/categories')
  .as('api.v1.categories')
