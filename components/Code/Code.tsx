import hljs from 'highlight.js';
import styles from './Code.module.scss';

type CodeProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

export default function Code({ className, children }: CodeProps) {
	const match = /language-(\w+)/.exec(className || '');
	const html = hljs.highlight(children as string, { language: match?.[1] ?? 'tsx' }).value;

	return <code className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function CodeInline(props: CodeProps) {
	return <Code {...props} className={`${props.className} ${styles.inline}`} />;
}

export function CodeBlock({ children }: { children: { props: CodeProps } }) {
	return (
		<pre className={styles.block}>
			<Code {...children!.props} />
		</pre>
	);
}
