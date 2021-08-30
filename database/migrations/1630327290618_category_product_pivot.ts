import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CategoryProductPivot extends BaseSchema {
  protected tableName = 'category_product'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('category_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('categories')
        .onDelete('CASCADE')

      table
        .integer('product_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')

      // preventing duplicates
      table.unique(['category_id', 'product_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
