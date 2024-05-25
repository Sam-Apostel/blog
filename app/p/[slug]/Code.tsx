import hljs from 'highlight.js';
import { CodeProps } from 'react-markdown/lib/ast-to-react';
import styles from './Code.module.scss';

export default function Code({ className, children }: CodeProps) {
	const match = /language-(\w+)/.exec(className || '');
	const html = hljs.highlight(children.join(''), { language: match?.[1] ?? 'tsx' }).value;

	return <code className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function CodeInline(props: CodeProps) {
	return <Code {...props} className={`${props.className} ${styles.inline}`} />;
}

export function CodeBlock({ children }: { children: [{ props: CodeProps }] }) {
	return (
		<pre className={styles.block}>
			<Code {...children![0]!.props} />
		</pre>
	);
}
