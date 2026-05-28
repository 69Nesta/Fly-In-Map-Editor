import { Data } from '@generated/data'
import { Link, usePage } from '@inertiajs/react'
import { ChevronDown } from 'lucide-react'
import { ReactElement, useEffect } from 'react'
import { toast, Toaster } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

const appName = import.meta.env.VITE_APP_NAME || 'Flyin Editor'

export default function DefaultLayout({ children }: { children: ReactElement<Data.SharedProps> }) {
	const page = usePage<Data.SharedProps>()
	const user = page.props.user ?? null

	useEffect(() => {
		toast.dismiss()
	}, [page.url])

	useEffect(() => {
		if (children.props.flash.error) {
			toast.error(children.props.flash.error)
		}
		if (children.props.flash.success) {
			toast.success(children.props.flash.success)
		}
	})

	const userInitials = [user?.firstName, user?.lastName]
		.filter(Boolean)
		.map((value) => value?.[0])
		.join('')
		|| user?.login?.slice(0, 2).toUpperCase()
		|| 'U'

	return (
		<div className="min-h-screen bg-background text-foreground">
			<header className="border-b">
				<div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
					<Button variant="ghost" asChild className="px-0 text-lg font-semibold hover:bg-transparent">
						<Link href="/workshop">{appName}</Link>
					</Button>

					{user ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="gap-2 px-2">
									<Avatar size="sm">
										<AvatarImage src={user.avatarUrl ?? undefined} alt={user.login ?? 'Profile avatar'} />
										<AvatarFallback>{userInitials}</AvatarFallback>
									</Avatar>
									<span className="hidden max-w-40 truncate text-sm font-medium sm:inline-block">
										{user.login ?? 'Profile'}
									</span>
									<ChevronDown className="size-4 text-muted-foreground" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48">
								<DropdownMenuLabel>
									<div className="flex flex-col gap-0.5">
										<span className="text-sm font-medium text-foreground">{user.login ?? 'Profile'}</span>
										{user.email ? <span className="text-xs font-normal text-muted-foreground">{user.email}</span> : null}
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link href="/profile">Profile</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link href="/logout" method="post" as="button">Logout</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : null}
				</div>
			</header>

			<main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
			<Toaster position="top-center" richColors />
		</div>
	)
}
