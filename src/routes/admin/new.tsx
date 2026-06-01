import { createFileRoute } from '@tanstack/react-router';
import { PostEditor } from '~/components/PostEditor';

export const Route = createFileRoute('/admin/new')({
	component: () => (
		<div className="space-y-4">
			<h1 className="text-2xl">New post</h1>
			<PostEditor />
		</div>
	),
});
