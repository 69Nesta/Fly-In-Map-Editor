import { UserSchema } from '#database/schema'
import Project from '#models/project'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
	@hasMany(() => Project)
	declare projects: HasMany<typeof Project>

	get initials() {
		// const [first, last] = this.fullName ? this.fullName.split(' ') : this.email.split('@')
		// if (first && last) {
		// 	return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
		// }
		// return `${first.slice(0, 2)}`.toUpperCase()
		return ''
	}
}
