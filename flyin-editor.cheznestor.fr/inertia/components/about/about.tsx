import { IconBrandGithub } from '@tabler/icons-react'
import { ExternalLink, ShieldQuestionMark } from 'lucide-react'

import { Button } from '~/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '~/components/ui/card'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '~/components/ui/dialog'
import { Separator } from '~/components/ui/separator'

const projectLinks = {
	liveDemo: 'https://flyin-editor.cheznestor.fr',
	repository: 'https://github.com/69Nesta/Fly-In-Map-Editor',
	issues: 'https://github.com/69Nesta/Fly-In-Map-Editor/issues',
	pulls: 'https://github.com/69Nesta/Fly-In-Map-Editor/pulls',
}

export function About() {
	return (
		<div className='absolute bottom-2 left-2 z-20'>
			<Dialog>
				<DialogTrigger asChild>
					<Button variant='outline' aria-label='Open About modal'>
						<ShieldQuestionMark />
					</Button>
				</DialogTrigger>
				<DialogContent className='sm:max-w-4xl'>
					<div className='space-y-6 p-6'>
						<DialogHeader className='space-y-3'>
							<div className='inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground'>
								<ShieldQuestionMark className='size-3.5' />
								About Flyin Editor
							</div>
							<DialogTitle className='text-2xl'>Flyin Map Editor.</DialogTitle>
							<DialogDescription className='max-w-xl text-sm leading-6'>
								Flyin Map Editor is a canvas-based editor for designing and managing drone
								network topologies. It combines nodes, routes, and property panels into a
								fast workflow for building interactive maps.
							</DialogDescription>
						</DialogHeader>

						<div className='grid gap-4 sm:grid-cols-2'>
							<Card size='sm' className='border-border/70 bg-background/80 shadow-none'>
								<CardHeader className='pb-3'>
									<CardTitle>Features</CardTitle>
									<CardDescription>
										Everything needed to design and manage drone network topologies.
									</CardDescription>
								</CardHeader>
								<CardContent className='space-y-2 text-sm text-muted-foreground'>
									<p>• Interactive canvas with zoom, pan, and drag support</p>
									<p>• Node and connection tools for topology design</p>
									<p>• Property panels for precise configuration</p>
									<p>• Import/export workflows for reusable projects</p>
								</CardContent>
							</Card>

							<Card size='sm' className='border-border/70 bg-background/80 shadow-none'>
								<CardHeader className='pb-3'>
									<CardTitle>Stack</CardTitle>
									<CardDescription>
										The app is built with AdonisJS, React, Inertia, shadcn/ui, and Konva.
									</CardDescription>
								</CardHeader>
								<CardContent className='space-y-2 text-sm text-muted-foreground'>
									<p>• AdonisJS for the backend and project routes</p>
									<p>• React and Inertia for the UI layer</p>
									<p>• shadcn/ui for reusable interface components</p>
									<p>• Konva for the interactive canvas editor</p>
								</CardContent>
							</Card>
						</div>

						<Separator />

						<div className='grid gap-4 sm:grid-cols-2'>
							<div className='rounded-xl border border-border/70 bg-muted/40 p-4 text-sm text-muted-foreground'>
								<p className='font-medium text-foreground'>About me</p>
								<p className='mt-1 leading-6'>
									I’m <a href='github.com/69Nesta' className={'hover:underline'} target='_blank'>@69Nesta</a> (rpetit).
									I built this project to make Fly-in maps easier to explore, edit, and share.
								</p>
							</div>
							<div className='rounded-xl border border-border/70 bg-muted/40 p-4 text-sm text-muted-foreground'>
								<p className='font-medium text-foreground'>Open source</p>
								<p className='mt-1 leading-6'>
									The project is open source — feel free to open an issue or submit a pull
									request with ideas, fixes, or improvements.
								</p>
							</div>
						</div>

						<DialogFooter className='gap-3 sm:justify-between'>
							<div className='flex flex-wrap gap-2'>
								<Button asChild variant='outline'>
									<a href={projectLinks.liveDemo} target='_blank' rel='noreferrer'>
										<ExternalLink />
										<span>Live demo</span>
									</a>
								</Button>
								<Button asChild variant='outline'>
									<a href={projectLinks.repository} target='_blank' rel='noreferrer'>
										<IconBrandGithub />
										<span>GitHub</span>
									</a>
								</Button>
								<Button asChild variant='outline'>
									<a href={projectLinks.issues} target='_blank' rel='noreferrer'>
										<span>Open issue</span>
									</a>
								</Button>
								<Button asChild variant='outline'>
									<a href={projectLinks.pulls} target='_blank' rel='noreferrer'>
										<span>Pull request</span>
									</a>
								</Button>
							</div>
							<DialogClose asChild>
								<Button variant='default'>Close</Button>
							</DialogClose>
						</DialogFooter>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}