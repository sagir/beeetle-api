import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Product from 'App/Models/Product'
import { DateTime } from 'luxon'

export default class ProductSeeder extends BaseSeeder {
  private readonly products = [
    {
      name: 'Product 1',
      slug: 'product-1',
      code: 'PS-101',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis error voluptatum perferendis aliquid odio reiciendis enim quas eligendi neque earum, velit magnam ut aspernatur alias eaque tempora delectus qui vero! Ratione veritatis doloremque voluptates aspernatur aperiam eum incidunt, doloribus accusamus harum illum fuga, vel, eligendi molestias aliquid illo consequuntur optio!',
    },
    {
      name: 'Product 2',
      slug: 'product-2',
      code: 'PS-102',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis error voluptatum perferendis aliquid odio reiciendis enim quas eligendi neque earum, velit magnam ut aspernatur alias eaque tempora delectus qui vero! Ratione veritatis doloremque voluptates aspernatur aperiam eum incidunt, doloribus accusamus harum illum fuga, vel, eligendi molestias aliquid illo consequuntur optio!',
    },
    {
      name: 'Product 3',
      slug: 'product-3',
      code: 'PS-103',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis error voluptatum perferendis aliquid odio reiciendis enim quas eligendi neque earum, velit magnam ut aspernatur alias eaque tempora delectus qui vero! Ratione veritatis doloremque voluptates aspernatur aperiam eum incidunt, doloribus accusamus harum illum fuga, vel, eligendi molestias aliquid illo consequuntur optio!',
    },
    {
      name: 'Product 4',
      slug: 'product-4',
      code: 'PS-105',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis error voluptatum perferendis aliquid odio reiciendis enim quas eligendi neque earum, velit magnam ut aspernatur alias eaque tempora delectus qui vero! Ratione veritatis doloremque voluptates aspernatur aperiam eum incidunt, doloribus accusamus harum illum fuga, vel, eligendi molestias aliquid illo consequuntur optio!',
    },
  ]

  public async run() {
    for (let item of this.products) {
      const product = new Product()
      product.name = item.name
      product.slug = item.slug
      product.code = item.code
      product.description = item.description
      product.deactivatedAt = DateTime.now()
      await product.save()
    }
  }
}
