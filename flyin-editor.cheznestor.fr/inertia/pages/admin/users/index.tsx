import type { ReactElement } from 'react'
import { useState } from 'react'
import { Data } from '@generated/data'
import { router } from '@inertiajs/react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui/table'
import type { InertiaProps } from '~/types'
import AdminLayout from '~/layouts/admin'
import { DateTime } from 'luxon'

type AdminUser = {
	id: string
	login: string
	email: string | null
	firstName: string | null
	lastName: string | null
	avatarUrl: string | null
	createdAt: DateTime
	isAdmin: boolean
}

type PaginationMeta = {
	currentPage: number
	lastPage: number
	total: number
	nextPageUrl: string | null
	previousPageUrl: string | null
}

type AdminUsersPageProps = InertiaProps<{
	users: AdminUser[]
	meta: PaginationMeta
}>

function AdminUsersPage({ users, meta }: AdminUsersPageProps) {
	const [processingUserId, setProcessingUserId] = useState<string | null>(null)

	const updateAdmin = (user: AdminUser) => {
		setProcessingUserId(user.id)
		router.put(
			`/admin/users/${user.id}/admin`,
			{ isAdmin: !user.isAdmin },
			{
				preserveScroll: true,
				onFinish: () => setProcessingUserId(null),
			}
		)
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Accounts</h1>
				<p className="text-sm text-muted-foreground">All created accounts with admin role management.</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Users</CardTitle>
					<CardDescription>{meta.total} account(s) found.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Role</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{users.map((user) => (
								<TableRow key={user.id}>
									<TableCell>{user.id}</TableCell>
									<TableCell>{user.login || '-'}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>
										<Badge variant={user.isAdmin ? 'default' : 'secondary'}>
											{user.isAdmin ? 'Admin' : 'User'}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										<Button
											variant={user.isAdmin ? 'destructive' : 'outline'}
											onClick={() => updateAdmin(user)}
											disabled={processingUserId === user.id}
										>
											{processingUserId === user.id
												? 'Saving...'
												: user.isAdmin
													? 'Remove admin'
													: 'Make admin'}
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>

					<div className="flex items-center justify-between">
						<p className="text-sm text-muted-foreground">
							Page {meta.currentPage} of {meta.lastPage}
						</p>
						<div className="flex gap-2">
							<Button
								variant="outline"
								disabled={!meta.previousPageUrl}
								onClick={() => meta.previousPageUrl && router.visit(meta.previousPageUrl)}
							>
								Previous
							</Button>
							<Button
								variant="outline"
								disabled={!meta.nextPageUrl}
								onClick={() => meta.nextPageUrl && router.visit(meta.nextPageUrl)}
							>
								Next
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

AdminUsersPage.layout = (page: ReactElement<Data.SharedProps>) => <AdminLayout>{page}</AdminLayout>

export default AdminUsersPage
