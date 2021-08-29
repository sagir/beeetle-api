import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Suppliers extends BaseSchema {
  protected tableName = 'suppliers'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 100).notNullable()
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.string('phone', 15).notNullable().unique()
      table.string('address').nullable()
      table.timestamp('deactivated_at').nullable()
      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
