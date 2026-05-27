import type { HttpContext } from '@adonisjs/core/http'
import { Oauth2Driver } from '@adonisjs/ally'
import type { AllyUserContract, ApiRequestContract, Oauth2AccessToken, Oauth2DriverConfig, RedirectRequestContract } from '@adonisjs/ally/types'

type IntraUserPayload = {
	id: string | number
	login: string
	email: string | null
	displayname?: string | null
	usual_full_name?: string | null
	image?: {
		link?: string | null
	} | null
}

type IntraDriverConfig = Oauth2DriverConfig & {
	scopes?: string[]
	userInfoUrl?: string
}

class IntraDriver extends Oauth2Driver<Oauth2AccessToken, string> {
	config: IntraDriverConfig
	protected accessTokenUrl = 'https://api.intra.42.fr/oauth/token'
	protected authorizeUrl = 'https://api.intra.42.fr/oauth/authorize'
	protected userInfoUrl = 'https://api.intra.42.fr/v2/me'
	protected codeParamName = 'code'
	protected errorParamName = 'error'
	protected stateCookieName = 'intra_oauth_state'
	protected stateParamName = 'state'
	protected scopeParamName = 'scope'
	protected scopesSeparator = ' '

	constructor(ctx: HttpContext, config: IntraDriverConfig) {
		super(ctx, config)
		this.config = config
		this.loadState()
	}

	protected configureRedirectRequest(request: RedirectRequestContract<string>) {
		request.scopes(this.config.scopes || ['public'])
		request.param('response_type', 'code')
	}

	protected getAuthenticatedRequest(url: string, token: string) {
		const request = this.httpClient(url)
		request.header('Authorization', `Bearer ${token}`)
		request.header('Accept', 'application/json')
		request.parseAs('json')
		return request
	}

	accessDenied() {
		const error = this.getError()
		if (!error) {
			return false
		}

		return error === 'access_denied' || error === 'user_denied'
	}

	async getUserInfo(token: string, callback?: (request: ApiRequestContract) => void): Promise<AllyUserContract<Oauth2AccessToken>> {
		const request = this.getAuthenticatedRequest(this.config.userInfoUrl || this.userInfoUrl, token)

		if (typeof callback === 'function') {
			callback(request)
		}

		const body = (await request.get()) as IntraUserPayload

		return {
			id: String(body.id),
			nickName: body.login,
			name: body.usual_full_name || body.displayname || body.login,
			email: body.email,
			emailVerificationState: body.email ? 'verified' : 'unsupported',
			avatarUrl: body.image?.link || null,
			token: { token, type: 'bearer' as const },
			original: body,
		}
	}

	async user(callback?: (request: ApiRequestContract) => void) {
		const token = await this.accessToken(callback)
		const user = await this.getUserInfo(token.token, callback)

		return {
			...user,
			token,
		}
	}

	async userFromToken(token: string, callback?: (request: ApiRequestContract) => void) {
		const user = await this.getUserInfo(token, callback)

		return {
			...user,
			token: { token, type: 'bearer' as const },
		}
	}
}

export default function intra(config: IntraDriverConfig) {
	return (ctx: HttpContext) => new IntraDriver(ctx, config)
}
