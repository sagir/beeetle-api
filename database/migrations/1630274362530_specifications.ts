import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Specifications extends BaseSchema {
  protected tableName = 'specifications'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 100).notNullable().unique()
      table.text('description').nullable()
      table.timestamp('deactivated_at').nullable()
      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
