import Project from '#models/project'
import { transformProject, transformProjects } from '#transformers/project_transformer'
import type { HttpContext } from '@adonisjs/core/http'

export default class WorkshopController {
	async index({ inertia }: HttpContext) {
		const projects = await Project.query()
			.where('visibility', 'public')
			.preload('user')
			.orderBy('updated_at', 'desc')

		return inertia.render('workshop/index', {
			projects: transformProjects(projects),
		})
	}

	async show({ auth, inertia, params }: HttpContext) {
		try {
			const project = await Project.query()
				.where('id', params.id)
				.where('visibility', 'public')
				.preload('user')
				.firstOrFail()

			const projects = await Project.query()
				.where('visibility', 'public')
				.preload('user')
				.orderBy('updated_at', 'desc')

			return inertia.render('home', {
				project: transformProject(project),
				projects: transformProjects(projects),
				readOnly: true,
				canImport: Boolean(auth.user),
			})
		} catch (error) {
			return inertia.render('errors/not_found', {}, { status: 404 })
		}
	}
}
