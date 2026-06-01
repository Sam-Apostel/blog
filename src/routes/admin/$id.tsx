import { createFileRoute, notFound } from '@tanstack/react-router';
import { getPostById } from '~/server/admin';
import { PostEditor } from '~/components/PostEditor';

export const Route = createFileRoute('/admin/$id')({
	loader: async ({ params }) => {
		const post = await getPostById({ data: { id: params.id } });
		if (!post) throw notFound();
		return post;
	},
	component: EditPost,
});

function EditPost() {
	const post = Route.useLoaderData();
	return (
		<div className="space-y-4">
			<h1 className="text-2xl">Edit post</h1>
			<PostEditor post={post} />
		</div>
	);
}
