import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Role from 'App/Models/Role'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    const superAdmin = new User()
    superAdmin.name = 'Sagir Hossain'
    superAdmin.email = 'sagir@admin.com'
    superAdmin.password = '123456'
    await superAdmin.save()

    const manager = new User()
    manager.name = 'John Doe'
    manager.email = 'john@admin.com'
    manager.password = '123456'
    await manager.save()

    const superAdminRole = await Role.findByOrFail('slug', 'super-admin')
    const managerAdminRole = await Role.findByOrFail('slug', 'manager')

    await superAdmin.related('roles').attach([superAdminRole.id])
    await manager.related('roles').attach([managerAdminRole.id])
  }
}
