import { Link } from '@inertiajs/react'
import type { ReactElement } from 'react'

import DefaultLayout from '~/layouts/default'
import type { InertiaProps } from '~/types'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { ProjectSummary } from '~/types/project_summary'

type WorkshopPageProps = InertiaProps<{
	projects: ProjectSummary[]
}>

function WorkshopIndexPage({ projects }: WorkshopPageProps) {
	return (
		<div className='space-y-6'>
			<div className='flex items-start justify-between gap-4'>
				<div>
					<h1 className='text-2xl font-bold'>Workshop</h1>
					<p className='text-sm text-muted-foreground'>Browse public maps, preview them in read-only mode, and import one to edit if you are signed in.</p>
				</div>
				<Button asChild variant='outline'>
					<Link href='/'>Open editor</Link>
				</Button>
			</div>

			<div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
				{projects.map((project) => (
					<Card key={project.id} className='border-border/70 bg-background/80'>
						<CardHeader className='space-y-2'>
							<div className='flex items-start justify-between gap-3'>
								<div className='space-y-1'>
									<CardTitle className='line-clamp-1'>{project.name}</CardTitle>
									<CardDescription className='line-clamp-2'>{project.description || 'No description'}</CardDescription>
								</div>
								<Badge variant='secondary'>{project.visibility}</Badge>
							</div>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='space-y-1 text-sm text-muted-foreground'>
								<p>Owner: {project.ownerLogin || 'Unknown'}</p>
								<p>Updated: {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}</p>
							</div>
							<Button asChild className='w-full'>
								<Link href={`/workshop/${project.id}`}>Preview</Link>
							</Button>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	)
}

WorkshopIndexPage.layout = (page: ReactElement<InertiaProps>) => <DefaultLayout>{page}</DefaultLayout>

export default WorkshopIndexPage
