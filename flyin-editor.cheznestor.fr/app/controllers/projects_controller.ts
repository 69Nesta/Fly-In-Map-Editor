import Project from '#models/project'
import { transformProject, transformProjects } from '#transformers/project_transformer'
// import ProjectTransformer from '#transformers/project_transformer'
import { projectFormValidator } from '#validators/project'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'


const buildStarterContent = () => [
	'nb_drones: 1',
	'',
	'start_hub: start 0 0 [max_drones=1]',
	'end_hub: end 5 0 [max_drones=1]',
	'connection: start-end',
	'',
].join('\n')

export default class ProjectsController {
	async index({ auth, inertia }: HttpContext) {
		const projects = await auth.user!.related('projects').query().orderBy('updated_at', 'desc')

		return inertia.render('projects/index', {
			projects: transformProjects(projects),
		})
	}

	async store({ auth, request, response, session }: HttpContext) {
		logger.info('Creating new project')
		const payload = await request.validateUsing(projectFormValidator)

		const project = await Project.create({
			userId: auth.user!.id,
			name: payload.name,
			description: payload.description,
			visibility: payload.visibility,
			content: payload.content || buildStarterContent(),
			thumbnailUrl: null,
		})

		session.flash('success', `Project ${project.name} created`)
		return response.redirect().toRoute('projects.show', { id: project.id })
	}

	async update({ auth, params, request, response, session }: HttpContext) {
		const payload = await request.validateUsing(projectFormValidator)
		const isAutosave = request.header('x-autosave') === 'true'
		const project = await Project.query()
			.where('id', params.id)
			.where('user_id', auth.user!.id)
			.firstOrFail()

		project.name = payload.name
		project.description = payload.description
		project.visibility = payload.visibility
		project.content = payload.content
		await project.save()

		if (!isAutosave)
			session.flash('success', `Project ${project.name} saved`)
		return response.redirect().toRoute('projects.show', { id: project.id })
	}

	async show({ auth, inertia, params }: HttpContext) {
		const project = await Project.query()
			.where('id', params.id)
			.where((query) => {
				query.where('user_id', auth.user!.id).orWhere('visibility', 'public')
			})
			.firstOrFail()

		const projects = await auth.user!.related('projects').query().orderBy('updated_at', 'desc')

		return inertia.render('home', {
			project: transformProject(project),
			projects: transformProjects(projects),
		})
	}
}