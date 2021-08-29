import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'

interface PermissionDependency {
  model: string
  permissions: string[]
}

interface ActionObject {
  name: string
  dependencies?: PermissionDependency[]
}

interface PermissionObject {
  model: string
  actions: ActionObject[]
}

export default class PermissionSeeder extends BaseSeeder {
  // menu permission will be used for frontent menus
  private readonly permissions: PermissionObject[] = [
    {
      model: 'role',
      actions: [
        { name: 'read' },
        {
          name: 'create',
          dependencies: [{ model: 'role', permissions: ['read'] }],
        },
        {
          name: 'update',
          dependencies: [{ model: 'role', permissions: ['read'] }],
        },
        {
          name: 'delete',
          dependencies: [{ model: 'role', permissions: ['read'] }],
        },
        {
          name: 'activate',
          dependencies: [{ model: 'role', permissions: ['read'] }],
        },
        {
          name: 'deactivate',
          dependencies: [{ model: 'role', permissions: ['read'] }],
        },
        {
          name: 'menu',
          dependencies: [{ model: 'admin', permissions: ['read'] }],
        },
      ],
    },
    {
      model: 'user',
      actions: [
        {
          name: 'read',
          dependencies: [{ model: 'role', permissions: ['read'] }],
        },
        {
          name: 'create',
          dependencies: [
            { model: 'admin', permissions: ['read'] },
            { model: 'role', permissions: ['read'] },
          ],
        },
        {
          name: 'update',
          dependencies: [
            { model: 'admin', permissions: ['read'] },
            { model: 'role', permissions: ['read'] },
          ],
        },
        {
          name: 'delete',
          dependencies: [
            { model: 'admin', permissions: ['read'] },
            { model: 'role', permissions: ['read'] },
          ],
        },
        {
          name: 'activate',
          dependencies: [
            { model: 'admin', permissions: ['read'] },
            { model: 'role', permissions: ['read'] },
          ],
        },
        {
          name: 'deactivate',
          dependencies: [
            { model: 'admin', permissions: ['read'] },
            { model: 'role', permissions: ['read'] },
          ],
        },
        {
          name: 'menu',
          dependencies: [
            { model: 'admin', permissions: ['read'] },
            { model: 'role', permissions: ['read'] },
          ],
        },
      ],
    },
  ]

  public async run() {
    for (let item of this.permissions) {
      for (let action of item.actions) {
        const permission = new Permission()
        permission.model = item.model
        permission.action = action.name
        await permission.save()

        if (action.dependencies?.length) {
          const query = Permission.query().select('*')

          action.dependencies.forEach((dependency) => {
            query.orWhere((whereQuery) => {
              whereQuery
                .where('model', dependency.model)
                .andWhereIn('action', dependency.permissions)
            })
          })

          const ids = (await query.exec()).map((p) => p.id)
          await permission.related('dependsOn').attach(ids)
        }
      }
    }
  }
}
