import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { signIn } from '~/lib/auth-client';

export const Route = createFileRoute('/login')({
	head: () => ({ meta: [{ title: 'Sign in' }] }),
	component: Login,
});

function Login() {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		const { error } = await signIn.email({ email, password });
		setLoading(false);
		if (error) {
			setError(error.message ?? 'Sign in failed');
			return;
		}
		navigate({ to: '/admin' });
	}

	return (
		<div className="mx-auto max-w-sm space-y-6 py-10">
			<h1 className="text-2xl">Sign in</h1>
			<form onSubmit={onSubmit} className="space-y-4">
				<label className="block space-y-1">
					<span className="text-sm text-muted">Email</span>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="w-full rounded-[var(--radius)] border border-default bg-surface px-3 py-2"
					/>
				</label>
				<label className="block space-y-1">
					<span className="text-sm text-muted">Password</span>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="w-full rounded-[var(--radius)] border border-default bg-surface px-3 py-2"
					/>
				</label>
				{error && <p className="text-sm text-accent">{error}</p>}
				<button
					type="submit"
					disabled={loading}
					className="rounded-[var(--radius)] bg-accent px-4 py-2 disabled:opacity-50"
				>
					{loading ? 'Signing in…' : 'Sign in'}
				</button>
			</form>
		</div>
	);
}
