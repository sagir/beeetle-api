import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('', 'SpecificationsController.index').as('index')
  Route.get('inactive', 'SpecificationsController.inactive').as('index.inactive')
  Route.post('', 'SpecificationsController.store').as('store')
  Route.get(':id', 'SpecificationsController.show').as('show')
  Route.put(':id', 'SpecificationsController.update').as('update')
  Route.delete(':id', 'SpecificationsController.destroy').as('destroy')
  Route.patch(':id/activate', 'SpecificationsController.activate').as('activate')
  Route.patch(':id/deactivate', 'SpecificationsController.deactivate').as('deactivate')
})
  .prefix('api/v1/specifications')
  .middleware('auth')
  .as('api.v1.specifications')
