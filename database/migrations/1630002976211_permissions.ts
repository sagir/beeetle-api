import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Permissions extends BaseSchema {
  protected tableName = 'permissions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('model', 100).notNullable()
      table.string('action', 100).notNullable()
      table.timestamps()
      // to prevent duplicated actions
      table.unique(['model', 'action'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
