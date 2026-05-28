import { Link, usePage } from '@inertiajs/react'
import type { ReactElement } from 'react'

import DefaultLayout from '~/layouts/default'
import type { InertiaProps } from '~/types'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

function ProfilePage() {
	const { user } = usePage<InertiaProps>().props

	if (!user) {
		return null
	}

	const initials = [user.firstName, user.lastName]
		.filter(Boolean)
		.map((value) => value?.[0])
		.join('')
		|| user.login?.slice(0, 2).toUpperCase()
		|| 'U'

	return (
		<div className="space-y-6">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold">Profile</h1>
					<p className="text-sm text-muted-foreground">Review your account information and sign out when you’re done.</p>
				</div>
				<Button asChild variant="outline">
					<Link href="/workshop">Back to workshop</Link>
				</Button>
			</div>

			<Card className="max-w-2xl">
				<CardHeader className="flex flex-row items-center gap-4 space-y-0">
					<Avatar size="lg">
						<AvatarImage src={user.avatarUrl ?? undefined} alt={user.login ?? 'Profile avatar'} />
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
					<div className="space-y-2">
						<CardTitle>{user.login ?? 'Profile'}</CardTitle>
						<CardDescription>{user.email ?? 'No email available'}</CardDescription>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-3 text-sm sm:grid-cols-2">
						<div className="rounded-lg border bg-muted/30 p-3">
							<div className="text-muted-foreground">Login</div>
							<div className="font-medium">{user.login ?? '—'}</div>
						</div>
						<div className="rounded-lg border bg-muted/30 p-3">
							<div className="text-muted-foreground">Email</div>
							<div className="font-medium">{user.email ?? '—'}</div>
						</div>
						<div className="rounded-lg border bg-muted/30 p-3">
							<div className="text-muted-foreground">Role</div>
							<div className="font-medium">
								<Badge variant={user.isAdmin ? 'default' : 'secondary'}>{user.isAdmin ? 'Admin' : 'User'}</Badge>
							</div>
						</div>
						<div className="rounded-lg border bg-muted/30 p-3">
							<div className="text-muted-foreground">Name</div>
							<div className="font-medium">{[user.firstName, user.lastName].filter(Boolean).join(' ') || '—'}</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

ProfilePage.layout = (page: ReactElement<InertiaProps>) => <DefaultLayout>{page}</DefaultLayout>

export default ProfilePage
