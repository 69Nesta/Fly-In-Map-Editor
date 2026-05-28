import { Link } from '@inertiajs/react'
import type { ReactElement } from 'react'

import DefaultLayout from '~/layouts/default'
import type { InertiaProps } from '~/types'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'

type ProjectSummary = {
	id: string
	name: string
	description: string | null
	visibility: 'private' | 'public'
	createdAt: string | null
	updatedAt: string | null
}

type ProjectsPageProps = InertiaProps<{
	projects: ProjectSummary[]
}>

function ProjectsIndexPage({ projects }: ProjectsPageProps) {
	return (
		<div className='space-y-6'>
			<div className='flex items-start justify-between gap-4'>
				<div>
					<h1 className='text-2xl font-bold'>My projects</h1>
					<p className='text-sm text-muted-foreground'>Open a project to continue editing or start a new one from the editor.</p>
				</div>
				<Button asChild>
					<Link href='/'>New project</Link>
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Projects</CardTitle>
					<CardDescription>{projects.length} project(s) found.</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Description</TableHead>
								<TableHead>Visibility</TableHead>
								<TableHead className='text-right'>Action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{projects.map((project) => (
								<TableRow key={project.id}>
									<TableCell className='font-medium'>{project.name}</TableCell>
									<TableCell className='max-w-xl text-muted-foreground'>{project.description || '-'}</TableCell>
									<TableCell>
										<Badge variant={project.visibility === 'public' ? 'default' : 'secondary'}>
											{project.visibility}
										</Badge>
									</TableCell>
									<TableCell className='text-right'>
										<Button asChild variant='outline'>
											<Link href={`/projects/${project.id}`}>Open</Link>
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	)
}

ProjectsIndexPage.layout = (page: ReactElement<InertiaProps>) => <DefaultLayout>{page}</DefaultLayout>

export default ProjectsIndexPage