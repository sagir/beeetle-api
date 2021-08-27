import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PermissionDependenciesPivots extends BaseSchema {
  protected tableName = 'permission_dependencies_pivot'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('permission_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('permissions')
        .onDelete('CASCADE')

      table
        .integer('depends_on')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('permissions')
        .onDelete('CASCADE')

      // to prevent duplication
      table.unique(['permission_id', 'depends_on'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
