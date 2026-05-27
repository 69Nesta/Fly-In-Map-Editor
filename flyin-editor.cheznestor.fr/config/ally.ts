import env from '#start/env'
import { defineConfig } from '@adonisjs/ally'
import intra_driver from '#providers/ally/intra_driver'

const allyConfig = defineConfig({
	intra: intra_driver({
		clientId: env.get('INTRA_UID'),
		clientSecret: env.get('INTRA_SECRET'),
		callbackUrl: `${env.get('APP_URL')}/oauth/intra/callback`,
		scopes: ['public'],
	}),
})

export default allyConfig

declare module '@adonisjs/ally/types' {
	interface SocialProviders extends InferSocialProviders<typeof allyConfig> { }
}