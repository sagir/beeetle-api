import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Category from 'App/Models/Category'

export default class CategorySeeder extends BaseSeeder {
  private readonly categories = [
    {
      name: 'Parent 1',
      slug: 'parent-1',
      children: [
        { name: 'Child 1', slug: 'child-1' },
        { name: 'Child 2', slug: 'child-2' },
        { name: 'Child 3', slug: 'child-3' },
        { name: 'Child 4', slug: 'child-4' },
      ],
    },
    {
      name: 'Parent 2',
      slug: 'parent-2',
      children: [
        { name: 'Child 5', slug: 'child-5' },
        { name: 'Child 6', slug: 'child-6' },
        { name: 'Child 7', slug: 'child-7' },
        { name: 'Child 8', slug: 'child-8' },
      ],
    },
    {
      name: 'Parent 3',
      slug: 'parent-3',
      children: [
        { name: 'Child 9', slug: 'child-9' },
        { name: 'Child 10', slug: 'child-10' },
      ],
    },
    {
      name: 'Parent 4',
      slug: 'parent-4',
      children: [
        { name: 'Child 11', slug: 'child-11' },
        { name: 'Child 12', slug: 'child-12' },
        { name: 'Child 13', slug: 'child-13' },
      ],
    },
    {
      name: 'Parent 5',
      slug: 'parent-5',
      children: [
        { name: 'Child 14', slug: 'child-14' },
        { name: 'Child 15', slug: 'child-15' },
        { name: 'Child 16', slug: 'child-16' },
        { name: 'Child 17', slug: 'child-17' },
        { name: 'Child 18', slug: 'child-18' },
      ],
    },
  ]

  public async run() {
    for (let item of this.categories) {
      const parent = new Category()
      parent.name = item.name
      parent.slug = item.slug
      await parent.save()

      await parent.related('children').createMany(item.children)
    }
  }
}
