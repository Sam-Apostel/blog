import ReactMarkdown from 'react-markdown';
import styles from './Markdown.module.scss';
import { CodeInline, CodeBlock } from '../Code/Code';
import Balancer from 'react-wrap-balancer';

export default function Markdown({ children }: { children?: string | null | undefined }) {
	return (
		<article className={styles.content}>
			<ReactMarkdown
				components={{
					code: CodeInline,
					/* @ts-ignore */
					pre: CodeBlock,
					h1: ({ children }) => <Balancer as="h1">{children}</Balancer>,
					h2: ({ children }) => <Balancer as="h2">{children}</Balancer>,
					h3: ({ children }) => (
						<Balancer ratio={0.7} as="p">
							{children}
						</Balancer>
					),
					img: (props) => {
						if (props.src?.endsWith('.mov')) {
							return (
								<video controls autoPlay>
									{/* @ts-expect-error */}
									<source {...props}></source>
								</video>
							);
						}
						return <img {...props} />;
					},
				}}
			>
				{children}
			</ReactMarkdown>
		</article>
	);
}
