import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProductSpecificationPivot extends BaseSchema {
  protected tableName = 'product_specification'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('product_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')

      table
        .integer('specification_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('specifications')
        .onDelete('CASCADE')

      // preventing duplicates
      table.unique(['product_id', 'specification_id'])

      // pivot extra columns
      table.text('value').notNullable()
      table.boolean('visible').notNullable().defaultTo(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
