import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Categories extends BaseSchema {
  protected tableName = 'categories'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 100).notNullable()
      table.string('slug', 100).notNullable()
      table.text('description').nullable()
      table.timestamp('deactivated_at').nullable()
      table.timestamps()
    })

    this.schema.table(this.tableName, (table) => {
      table
        .integer('parent_id')
        .unsigned()
        .nullable()
        .after('description')
        .references('id')
        .inTable(this.tableName)
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
