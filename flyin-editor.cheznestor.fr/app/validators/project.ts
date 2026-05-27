import vine from '@vinejs/vine'

export const projectVisibility = vine.enum(['private', 'public'])

export const projectFormValidator = vine.create({
	name: vine.string().trim().minLength(1).maxLength(120),
	description: vine.string().trim().maxLength(500).nullable(),
	visibility: projectVisibility,
	content: vine.string().minLength(1),
})