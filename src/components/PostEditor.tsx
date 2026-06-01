import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Markdown } from './Markdown';
import { savePost } from '~/server/admin';
import { MODES, MODE_LABELS, type Mode } from '~/lib/theme';
import type { Post } from '~/db/schema';

type Props = { post?: Post };

/** A simple markdown editor with live preview for writing posts. */
export function PostEditor({ post }: Props) {
	const navigate = useNavigate();
	const [title, setTitle] = useState(post?.title ?? '');
	const [slug, setSlug] = useState(post?.slug ?? '');
	const [hook, setHook] = useState(post?.hook ?? '');
	const [mode, setMode] = useState<Mode>((post?.mode as Mode) ?? 'software');
	const [cover, setCover] = useState(post?.cover ?? '');
	const [canonical, setCanonical] = useState(post?.canonical ?? '');
	const [content, setContent] = useState(post?.content ?? '');
	const [published, setPublished] = useState(Boolean(post?.publishedAt));
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const slugify = (s: string) =>
		s
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '');

	async function onSave() {
		setSaving(true);
		setError(null);
		try {
			const result = await savePost({
				data: { id: post?.id, title, slug: slug || slugify(title), hook, mode, cover, canonical, content, published },
			});
			navigate({ to: '/admin/$id', params: { id: result.id } });
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Failed to save');
		} finally {
			setSaving(false);
		}
	}

	const inputClass = 'w-full rounded-[var(--radius)] border border-default bg-surface px-3 py-2 text-sm';

	return (
		<div className="space-y-4">
			<div className="grid gap-3 sm:grid-cols-2">
				<label className="space-y-1">
					<span className="text-xs text-muted">Title</span>
					<input
						className={inputClass}
						value={title}
						onChange={(e) => {
							setTitle(e.target.value);
							if (!post && !slug) setSlug(slugify(e.target.value));
						}}
					/>
				</label>
				<label className="space-y-1">
					<span className="text-xs text-muted">Slug</span>
					<input className={inputClass} value={slug} onChange={(e) => setSlug(e.target.value)} />
				</label>
				<label className="space-y-1">
					<span className="text-xs text-muted">Mode</span>
					<select className={inputClass} value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
						{MODES.map((m) => (
							<option key={m} value={m}>
								{MODE_LABELS[m]}
							</option>
						))}
					</select>
				</label>
				<label className="space-y-1">
					<span className="text-xs text-muted">Cover URL</span>
					<input className={inputClass} value={cover} onChange={(e) => setCover(e.target.value)} />
				</label>
			</div>
			<label className="block space-y-1">
				<span className="text-xs text-muted">Hook</span>
				<input className={inputClass} value={hook} onChange={(e) => setHook(e.target.value)} />
			</label>

			<div className="grid gap-3 lg:grid-cols-2">
				<label className="space-y-1">
					<span className="text-xs text-muted">Markdown</span>
					<textarea
						className={inputClass + ' min-h-[28rem] font-mono'}
						value={content}
						onChange={(e) => setContent(e.target.value)}
					/>
				</label>
				<div className="space-y-1">
					<span className="text-xs text-muted">Preview</span>
					<div className="min-h-[28rem] overflow-auto rounded-[var(--radius)] border border-default bg-surface p-4">
						<Markdown>{content || '_Nothing to preview yet._'}</Markdown>
					</div>
				</div>
			</div>

			{error && <p className="text-sm text-accent">{error}</p>}
			<div className="flex items-center gap-4">
				<label className="flex items-center gap-2 text-sm">
					<input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
					Published
				</label>
				<button
					onClick={onSave}
					disabled={saving || !title}
					className="rounded-[var(--radius)] bg-accent px-4 py-2 text-sm disabled:opacity-50"
				>
					{saving ? 'Saving…' : 'Save'}
				</button>
			</div>
		</div>
	);
}
