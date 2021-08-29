import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('', 'StoresController.index').as('index')
  Route.post('', 'StoresController.store').as('store')
  Route.get(':slug', 'StoresController.show').as('show')
  Route.put(':slug', 'StoresController.update').as('update')
  Route.delete(':slug', 'StoresController.destroy').as('destroy')
  Route.patch(':slug/activate', 'StoresController.activate').as('activate')
  Route.patch(':slug/deactivate', 'StoresController.deactivate').as('deactivate')
})
  .prefix('api/v1/stores')
  .middleware('auth')
  .as('api.v1.stores')
