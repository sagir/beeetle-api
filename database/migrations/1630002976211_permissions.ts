import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Permissions extends BaseSchema {
  protected tableName = 'permissions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('model', 100).notNullable()
      table.string('action', 100).notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      // to prevent duplicated actions
      table.unique(['model', 'action'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
