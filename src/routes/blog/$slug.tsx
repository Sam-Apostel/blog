import { createFileRoute, notFound } from '@tanstack/react-router';
import { getPost } from '~/server/queries';
import { Markdown } from '~/components/Markdown';
import { MODE_LABELS } from '~/lib/theme';

export const Route = createFileRoute('/blog/$slug')({
	loader: async ({ params }) => {
		const post = await getPost({ data: { slug: params.slug } });
		if (!post || !post.publishedAt) throw notFound();
		return post;
	},
	head: ({ loaderData }) => ({
		meta: loaderData
			? [
					{ title: `${loaderData.title} | Sam Apostel` },
					{ name: 'description', content: loaderData.hook },
					{ property: 'og:title', content: loaderData.title },
					{ property: 'og:description', content: loaderData.hook },
					{ property: 'og:image', content: `/api/og?slug=${loaderData.slug}` },
				]
			: [],
	}),
	component: PostPage,
});

function PostPage() {
	const post = Route.useLoaderData();
	return (
		<article className="space-y-6">
			<header className="space-y-3 border-b border-default pb-6">
				<div className="flex items-center gap-3 text-xs uppercase tracking-wide text-muted">
					<span>{MODE_LABELS[post.mode]}</span>
					{post.publishedAt && (
						<time dateTime={new Date(post.publishedAt).toISOString()}>
							{new Date(post.publishedAt).toLocaleDateString('en-GB', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</time>
					)}
				</div>
				<h1 className="text-3xl sm:text-4xl">{post.title}</h1>
				{post.hook && <p className="text-lg text-muted">{post.hook}</p>}
			</header>
			<Markdown>{post.content}</Markdown>
		</article>
	);
}
