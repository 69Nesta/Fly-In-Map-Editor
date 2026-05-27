import './css/app.css'
import { ReactElement, ComponentType } from 'react'
import { client } from './client'
import Layout from '~/layouts/default'
import { Data } from '@generated/data'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

const appName = import.meta.env.VITE_APP_NAME || 'Flyin Editor'

type LayoutablePageModule = {
	default: ComponentType & {
		layout?: (page: ReactElement<Data.SharedProps>) => ReactElement
	}
}

createInertiaApp({
	title: (title) => (title ? `${title} - ${appName}` : appName),
	resolve: (name) => {
		return resolvePageComponent(
			`./pages/${name}.tsx`,
			import.meta.glob('./pages/**/*.tsx')
		).then((page) => {
			const resolvedPage = page as LayoutablePageModule
			resolvedPage.default.layout ??= (page: ReactElement<Data.SharedProps>) => <Layout>{page}</Layout>
			return resolvedPage
		})
	},
	setup({ el, App, props }) {
		createRoot(el).render(
			<TuyauProvider client={client}>
				<App {...props} />
			</TuyauProvider>
		)
	},
	progress: {
		color: '#4B5563',
	},
})
