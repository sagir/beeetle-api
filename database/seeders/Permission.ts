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
          dependencies: [{ model: 'role', permissions: ['read'] }],
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
            { model: 'user', permissions: ['read'] },
            { model: 'role', permissions: ['read'] },
          ],
        },
        {
          name: 'update',
          dependencies: [
            { model: 'user', permissions: ['read'] },
            { model: 'role', permissions: ['read'] },
          ],
        },
        {
          name: 'delete',
          dependencies: [
            { model: 'user', permissions: ['read'] },
            { model: 'role', permissions: ['read'] },
          ],
        },
        {
          name: 'activate',
          dependencies: [
            { model: 'user', permissions: ['read'] },
            { model: 'role', permissions: ['read'] },
          ],
        },
        {
          name: 'deactivate',
          dependencies: [
            { model: 'user', permissions: ['read'] },
            { model: 'role', permissions: ['read'] },
          ],
        },
        {
          name: 'menu',
          dependencies: [
            { model: 'user', permissions: ['read'] },
            { model: 'role', permissions: ['read'] },
          ],
        },
      ],
    },
    {
      model: 'store',
      actions: [
        { name: 'read' },
        { name: 'create', dependencies: [{ model: 'store', permissions: ['read'] }] },
        { name: 'update', dependencies: [{ model: 'store', permissions: ['read'] }] },
        { name: 'delete', dependencies: [{ model: 'store', permissions: ['read'] }] },
        { name: 'makeDefault', dependencies: [{ model: 'store', permissions: ['read'] }] },
        { name: 'activate', dependencies: [{ model: 'store', permissions: ['read'] }] },
        { name: 'deactivate', dependencies: [{ model: 'store', permissions: ['read'] }] },
      ],
    },
    {
      model: 'category',
      actions: [
        { name: 'read' },
        { name: 'create', dependencies: [{ model: 'category', permissions: ['read'] }] },
        { name: 'update', dependencies: [{ model: 'category', permissions: ['read'] }] },
        { name: 'delete', dependencies: [{ model: 'category', permissions: ['read'] }] },
        { name: 'activate', dependencies: [{ model: 'category', permissions: ['read'] }] },
        { name: 'deactivate', dependencies: [{ model: 'category', permissions: ['read'] }] },
      ],
    },
    {
      model: 'supplier',
      actions: [
        { name: 'read' },
        { name: 'create', dependencies: [{ model: 'supplier', permissions: ['read'] }] },
        { name: 'update', dependencies: [{ model: 'supplier', permissions: ['read'] }] },
        { name: 'delete', dependencies: [{ model: 'supplier', permissions: ['read'] }] },
        { name: 'activate', dependencies: [{ model: 'supplier', permissions: ['read'] }] },
        { name: 'deactivate', dependencies: [{ model: 'supplier', permissions: ['read'] }] },
      ],
    },
    {
      model: 'specification',
      actions: [
        { name: 'read' },
        { name: 'create', dependencies: [{ model: 'specification', permissions: ['read'] }] },
        { name: 'update', dependencies: [{ model: 'specification', permissions: ['read'] }] },
        { name: 'delete', dependencies: [{ model: 'specification', permissions: ['read'] }] },
        { name: 'activate', dependencies: [{ model: 'specification', permissions: ['read'] }] },
        { name: 'deactivate', dependencies: [{ model: 'specification', permissions: ['read'] }] },
      ],
    },
    {
      model: 'product',
      actions: [
        {
          name: 'read',
          dependencies: [
            { model: 'category', permissions: ['read'] },
            { model: 'supplier', permissions: ['read'] },
            { model: 'specification', permissions: ['read'] },
          ],
        },
        {
          name: 'create',
          dependencies: [
            { model: 'product', permissions: ['read'] },
            { model: 'category', permissions: ['read'] },
            { model: 'supplier', permissions: ['read'] },
            { model: 'specification', permissions: ['read'] },
          ],
        },
        {
          name: 'update',
          dependencies: [
            { model: 'product', permissions: ['read'] },
            { model: 'category', permissions: ['read'] },
            { model: 'supplier', permissions: ['read'] },
            { model: 'specification', permissions: ['read'] },
          ],
        },
        {
          name: 'delete',
          dependencies: [
            { model: 'product', permissions: ['read'] },
            { model: 'category', permissions: ['read'] },
            { model: 'supplier', permissions: ['read'] },
            { model: 'specification', permissions: ['read'] },
          ],
        },
        {
          name: 'activate',
          dependencies: [
            { model: 'product', permissions: ['read'] },
            { model: 'category', permissions: ['read'] },
            { model: 'supplier', permissions: ['read'] },
            { model: 'specification', permissions: ['read'] },
          ],
        },
        {
          name: 'deactivate',
          dependencies: [
            { model: 'product', permissions: ['read'] },
            { model: 'category', permissions: ['read'] },
            { model: 'supplier', permissions: ['read'] },
            { model: 'specification', permissions: ['read'] },
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
