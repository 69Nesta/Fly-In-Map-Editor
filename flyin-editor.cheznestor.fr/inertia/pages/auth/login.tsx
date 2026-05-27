import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

export default function Login() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-2 text-center">
					<CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
					<CardDescription>Sign in to your account to continue</CardDescription>
				</CardHeader>

				<CardContent className="space-y-6">
					<Button asChild className="w-full" variant="outline">
						<a href="/oauth/intra/redirect">Continue with Intra 42</a>
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}
