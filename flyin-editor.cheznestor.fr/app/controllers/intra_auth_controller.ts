import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
// import hash from '@adonisjs/core/services/hash'

// type IntraProfile = {
// 	id: string,
// 	login: string,
// 	name: string,
// 	email: string,
// 	emailVerificationState: 'verified' | 'unsupported',
// 	avatarUrl: string | null,
// 	token: { token: string, type: 'bearer' },
// 	original: JSON,
// }

export default class IntraAuthController {
	async redirect({ ally }: HttpContext) {
		return ally.use('intra').redirect()
	}

	async callback({ ally, auth, response }: HttpContext) {
		const intra = ally.use('intra')

		if (intra.accessDenied() || intra.hasError() || intra.stateMisMatch() || !intra.hasCode()) {
			return response.redirect().toRoute('session.create')
		}

		const profile = await intra.user()
		const email = profile.email?.trim().toLowerCase() || null

		let user = await User.findBy('login', profile.nickName)

		if (!user) {
			user = new User()
			user.login = profile.nickName
			user.token = profile.token.token
			user.intraId = profile.id
		}

		user.avatarUrl = profile.avatarUrl || null
		user.email = email
		user.fullName = profile.name || profile.nickName
		user.firstName = profile.original['first_name'] || null
		user.lastName = profile.original['last_name'] || null

		await user.save()

		await auth.use('web').login(user)
		return response.redirect().toRoute('home')
	}
}