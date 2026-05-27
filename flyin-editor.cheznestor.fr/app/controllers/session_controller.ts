import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
	async create({ inertia }: HttpContext) {
		return inertia.render('auth/login', {})
	}

	async destroy({ auth, response }: HttpContext) {
		await auth.use('web').logout()
		return response.redirect().toRoute('home')
	}
}
