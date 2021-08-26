import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'

interface PermissionArray {
  [key: string]: string[]
}

export default class PermissionSeeder extends BaseSeeder {
  // menu permission will be used for frontent menus
  private readonly permissions: PermissionArray = {
    admin: ['create', 'read', 'update', 'delete', 'menu', 'activate', 'deactivate'],
    role: ['create', 'read', 'update', 'delete', 'menu', 'activate', 'deactivate'],
  }

  public async run() {
    for (let model in this.permissions) {
      for (let action of this.permissions[model]) {
        const permission = new Permission()
        permission.model = model
        permission.action = action
        await permission.save()
      }
    }
  }
}
