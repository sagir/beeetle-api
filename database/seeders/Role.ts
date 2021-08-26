import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'
import Permission from 'App/Models/Permission'

export default class RoleSeeder extends BaseSeeder {
  public async run() {
    const permissions = await Permission.all()

    const superAdminRole = new Role()
    superAdminRole.name = 'Super Admin'
    superAdminRole.slug = 'super-admin'
    await superAdminRole.save()
    await superAdminRole.related('permissions').attach(permissions.map((item) => item.id))

    const managerRole = new Role()
    managerRole.name = 'Manager'
    managerRole.slug = 'manager'
    await managerRole.save()
    await managerRole.related('permissions').attach(
      <number[]>permissions
        .map((item) => {
          if (item.model !== 'admin') {
            return item.id
          }
        })
        .filter(Boolean)
    )
  }
}
