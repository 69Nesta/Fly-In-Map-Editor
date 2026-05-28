import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

import User from '#models/user'

export default class Project extends BaseModel {
	@column({ isPrimary: true })
	declare id: string

	@column()
	declare userId: string

	@column()
	declare name: string

	@column()
	declare description: string | null

	@column()
	declare visibility: 'private' | 'public'

	@column({ columnName: 'content' })
	declare content: string

	@column()
	declare thumbnailUrl: string | null

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime | null

	@belongsTo(() => User)
	declare user: BelongsTo<typeof User>
}