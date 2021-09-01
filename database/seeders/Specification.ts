import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Specification from 'App/Models/Specification'

export default class SpecificationSeeder extends BaseSeeder {
  private readonly specifications: string[] = [
    'Color',
    'Size',
    'Weight',
    'Warrenty',
    'Others',
    'Note',
  ]

  public async run() {
    for (let item of this.specifications) {
      const specification = new Specification()
      specification.name = item
      await specification.save()
    }
  }
}
