import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
	protected tableName = 'users'

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id').notNullable()
			table.string('login').notNullable().unique()
			table.string('email', 254).nullable().unique()
			table.string('token').notNullable()
			table.string('first_name').nullable()
			table.string('last_name').nullable()
			table.string('full_name').nullable()
			table.string('intra_id').notNullable().unique()
			table.string('avatar_url').nullable()

			table.boolean('is_admin').notNullable().defaultTo(false).index()

			table.timestamp('created_at').notNullable()
			table.timestamp('updated_at').nullable()
		})
	}

	async down() {
		this.schema.dropTable(this.tableName)
	}
}
