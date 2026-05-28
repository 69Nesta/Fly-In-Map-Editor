import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
	async create({ response }: HttpContext) {
		return response.redirect().toRoute('intra.redirect')
	}

	async destroy({ auth, response }: HttpContext) {
		await auth.use('web').logout()
		return response.redirect().toRoute('home')
	}
}
