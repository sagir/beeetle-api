import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('', 'StoresController.index').as('index')
  Route.post('', 'StoresController.store').as('store')
  Route.get(':stores', 'StoresController.show').as('show')
  Route.put(':stores', 'StoresController.update').as('update')
  Route.delete(':stores', 'StoresController.destroy').as('destroy')
  Route.patch(':stores/activate', 'StoresController.activate').as('activate')
  Route.patch(':stores/deactivate', 'StoresController.deactivate').as('deactivate')
})
  .prefix('api/v1/stores')
  .middleware('auth')
  .as('api.v1.stores')
