import User from '#models/user'
import { updateAdminStatusValidator } from '#validators/admin_user'
import type { HttpContext } from '@adonisjs/core/http'


export default class UsersController {
	async index({ request, inertia }: HttpContext) {
		const page = request.input('page', 1)
		const users = await User.query().orderBy('created_at', 'desc').paginate(page, 20)

		return inertia.render('admin/users/index', {
			users: users.all(),
			meta: users.getMeta(),
		})
	}

	async updateAdminStatus({ auth, params, request, response, session }: HttpContext) {
		const payload = await request.validateUsing(updateAdminStatusValidator)
		const targetUser = await User.findOrFail(params.id)

		if (auth.user!.id === targetUser.id && !payload.isAdmin) {
			session.flash('error', 'You cannot remove your own admin access')
			return response.redirect().back()
		}

		if (!payload.isAdmin && targetUser.isAdmin) {
			const adminCount = await User.query().where('is_admin', true).count('* as total')
			const totalAdmins = Number(adminCount[0]?.$extras.total ?? 0)

			if (totalAdmins <= 1) {
				session.flash('error', 'At least one admin account is required')
				return response.redirect().back()
			}
		}

		targetUser.isAdmin = payload.isAdmin
		await targetUser.save()

		session.flash('success', `Admin access updated for ${targetUser.email}`)
		return response.redirect().back()
	}
}
