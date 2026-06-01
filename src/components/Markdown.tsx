import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

/** Renders trusted markdown (authored by Sam) into themed HTML. */
export function Markdown({ children }: { children: string }) {
	return (
		<div className="prose-blog">
			<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
				{children}
			</ReactMarkdown>
		</div>
	);
}
