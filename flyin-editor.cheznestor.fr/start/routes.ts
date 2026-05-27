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
import router from '@adonisjs/core/services/router'
import { HttpContext } from '@adonisjs/core/http'
import { transformProjects } from '#transformers/project_transformer'

// type ProjectSummary = {
// 	id: string;
// 	userId: string;
// 	name: string;
// 	description: string | null;
// 	visibility: 'private' | 'public';
// 	content: string;
// 	thumbnailUrl: string | null;
// 	createdAt: string | null;
// 	updatedAt: string | null;
// }

// const serializeProject = (project: Awaited<ReturnType<typeof ProjectTransformer.transform>>) => ProjectTransformer.transform(project as never) as unknown as ProjectSummary

router.get('/', async ({ auth, inertia }: HttpContext) => {
	const projects = auth.user ? await auth.user.related('projects').query().orderBy('updated_at', 'desc') : []

	return inertia.render('home', {
		projects: transformProjects(projects),
	})
}).as('home')

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

		router.get('/projects/:id', [ProjectsController, 'show']).as('projects.show')
		router.put('/projects/:id', [ProjectsController, 'update']).as('projects.update')

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
