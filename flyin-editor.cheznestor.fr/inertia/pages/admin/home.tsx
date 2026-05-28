import type { ReactElement } from 'react'
import { Data } from '@generated/data'
import { Link } from '@inertiajs/react'
import AdminLayout from '~/layouts/admin'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

function AdminHome() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Dashboard</h1>
				<p className="text-sm text-muted-foreground">Manage accounts and admin permissions.</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Accounts</CardTitle>
					<CardDescription>See every created account and edit admin access.</CardDescription>
				</CardHeader>
				<CardContent>
					<Button asChild>
						<Link href="/admin/users">Open users table</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}

AdminHome.layout = (page: ReactElement<Data.SharedProps>) => <AdminLayout>{page}</AdminLayout>

export default AdminHome
