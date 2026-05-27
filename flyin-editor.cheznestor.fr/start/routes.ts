/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import IntraAuthController from '#controllers/intra_auth_controller'
import AdminUsersController from '#controllers/admin/users_controller'
import router from '@adonisjs/core/services/router'

router.on('/').renderInertia('home', {}).as('home')

router
	.group(() => {
		router.get('oauth/intra/redirect', [IntraAuthController, 'redirect']).as('intra.redirect')
		router.get('oauth/intra/callback', [IntraAuthController, 'callback']).as('intra.callback')

		router.get('login', [controllers.Session, 'create'])
	})
	.use(middleware.guest())

router
	.group(() => {
		router.post('logout', [controllers.Session, 'destroy']).as('logout')
		router.get('logout', [controllers.Session, 'destroy'])
	})
	.use(middleware.auth())

router
	.group(() => {
		router.get('/', ({ inertia }) => inertia.render('admin/home', {})).as('admin.home')
		router.get('/users', [AdminUsersController, 'index']).as('admin.users.index')
		router.put('/users/:id/admin', [AdminUsersController, 'updateAdminStatus']).as('admin.users.updateAdmin')
	})
	.prefix('/admin')
	.use([middleware.auth(), middleware.admin()])
