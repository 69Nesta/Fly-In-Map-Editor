import type { CommandOptions } from '@adonisjs/core/types/ace'
import { BaseCommand, args } from '@adonisjs/core/ace'

export default class AddAdmin extends BaseCommand {
	static commandName = 'add:admin'
	static description = ''

	static options: CommandOptions = {
		startApp: true,
	}

	@args.string()
  	declare id_intra: string

	async run() {
		const User = await import('#models/user')
		const user = await User.default.findBy('login', this.id_intra)

		if (!user)
			return this.logger.error(`User with intraId ${this.id_intra} not found`)

		if (await this.prompt.confirm(`Are you sure you want to make ${user.fullName} an admin?`)) {
			user.isAdmin = true
			await user.save()

			this.logger.success(`User ${user.fullName}(${this.id_intra}) is now an admin`)
		}
		else
			this.logger.info('Operation cancelled')
	}
}