import { Link, usePage } from '@inertiajs/react'
import { type PropsWithChildren } from 'react'
import { Button } from '~/components/ui/button'

const navItems = [
	{ href: '/admin', label: 'Dashboard' },
	{ href: '/admin/users', label: 'Accounts' },
]

export default function AdminLayout({ children }: PropsWithChildren) {
	const page = usePage()

	return (
		<div className="min-h-screen bg-background text-foreground">
			<header className="border-b">
				<div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
					<div className="text-lg font-semibold">Admin Panel</div>
					<nav className="flex items-center gap-2">
						{navItems.map((item) => {
							const isActive = page.url === item.href || page.url.startsWith(`${item.href}/`)
							return (
								<Button key={item.href} variant={isActive ? 'default' : 'outline'} asChild>
									<Link href={item.href}>{item.label}</Link>
								</Button>
							)
						})}
						<Button variant="ghost" asChild>
							<a href="/">Editor</a>
						</Button>
					</nav>
				</div>
			</header>

			<main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
		</div>
	)
}
