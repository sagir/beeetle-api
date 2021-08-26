import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PermissionRole extends BaseSchema {
  protected tableName = 'permission_role'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('permission_id')
        .unsigned()
        .references('id')
        .inTable('permissions')
        .onDelete('CASCADE')

      table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.unique(['permission_id', 'role_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
