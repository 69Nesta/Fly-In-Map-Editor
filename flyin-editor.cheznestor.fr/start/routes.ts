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
import ProjectsController from '#controllers/projects_controller'
import WorkshopController from '#controllers/workshop_controller'
import router from '@adonisjs/core/services/router'
import { HttpContext } from '@adonisjs/core/http'
import { transformProjects } from '#transformers/project_transformer'


router.get('/', async ({ auth, inertia }: HttpContext) => {
	const projects = auth.user ? await auth.user.related('projects').query().orderBy('updated_at', 'desc') : []

	return inertia.render('home', {
		projects: transformProjects(projects),
	})
}).as('home')

router.get('/workshop', [WorkshopController, 'index']).as('workshop.index')
router.get('/workshop/:id', [WorkshopController, 'show']).as('workshop.show')

router
	.group(() => {
		router.get('oauth/intra/redirect', [IntraAuthController, 'redirect']).as('intra.redirect')
		router.get('oauth/intra/callback', [IntraAuthController, 'callback']).as('intra.callback')

		router.get('login', [controllers.Session, 'create'])
	})
	.use(middleware.guest())

	router
	.group(() => {
		router.get('/projects', [ProjectsController, 'index']).as('projects.index')
		router.post('/projects', [ProjectsController, 'store']).as('projects.store')
		router.get('/profile', ({ inertia }) => inertia.render('profile', {})).as('profile')

		router.get('/projects/:id', [ProjectsController, 'show']).as('projects.show')
		router.put('/projects/:id', [ProjectsController, 'update']).as('projects.update')
		router.patch('/projects/:id', [ProjectsController, 'update_metadata']).as('projects.update-metadata')
		router.delete('/projects/:id', [ProjectsController, 'destroy']).as('projects.destroy')

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
