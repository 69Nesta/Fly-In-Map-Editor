import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'


/**
 * Admin middleware is used authenticate HTTP requests and deny
 * access unless the user is an admin.
 */
export default class AdminMiddleware {
	/**
	 * The URL to redirect to, when not admin
	 */
	redirectTo = '/'

	async handle(ctx: HttpContext, next: NextFn) {
		if (!ctx.auth.user?.isAdmin) {
			ctx.session.flash('error', 'You are not allowed to access the admin panel')
			return ctx.response.redirect().toRoute('home')
		}

		return next()
	}
}
