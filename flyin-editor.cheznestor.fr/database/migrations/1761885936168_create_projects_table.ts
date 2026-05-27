import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
	protected tableName = 'projects'

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
			table.uuid('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
			table.string('name').notNullable()
			table.text('description').nullable()
			table.enum('visibility', ['private', 'public']).notNullable().defaultTo('private')
			table.text('content').notNullable()
			table.string('thumbnail_url').nullable()

			table.timestamp('created_at').notNullable()
			table.timestamp('updated_at').nullable()
		})
	}

	async down() {
		this.schema.dropTable(this.tableName)
	}
}