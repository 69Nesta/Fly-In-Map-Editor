import vine from '@vinejs/vine'

export const updateAdminStatusValidator = vine.create({
	isAdmin: vine.boolean(),
})
