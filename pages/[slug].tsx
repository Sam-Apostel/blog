import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Article.module.scss'
import ReactMarkdown from 'react-markdown';
import { deserializeArticle, SerializedArticle } from '../firebase/types';
import { getAllArticleSlugs, getArticle } from '../firebase/firebase';

import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import typescript from 'react-syntax-highlighter/dist/cjs/languages/hljs/typescript';
import markdown from 'react-syntax-highlighter/dist/cjs/languages/hljs/markdown';
import dark from 'react-syntax-highlighter/dist/cjs/styles/hljs/a11y-dark'
import light from 'react-syntax-highlighter/dist/cjs/styles/hljs/a11y-light'
import useMatchMedia from '../hooks/useMatchMedia';
import Link from 'next/link';

SyntaxHighlighter.registerLanguage('ts', typescript)
SyntaxHighlighter.registerLanguage('md', markdown)

type Query = {
	slug: string;
}

export const getStaticPaths: GetStaticPaths<Query> = async () => {
	const slugs = await getAllArticleSlugs();
	return {
		paths: slugs.map(slug => ({ params: { slug } })),
		fallback: false
	}
}

export const getStaticProps: GetStaticProps<SerializedArticle, Query> = async ({ params }) => {
	const { slug } = params!

	const article = await getArticle(slug);
	return { props: article };
}

const Article: NextPage<SerializedArticle> = (serializedArticle) => {
	const prefersDark = useMatchMedia('(prefers-color-scheme: dark)');

	const {
		title,
		hook,
		subtitle,
		content,
	} = deserializeArticle(serializedArticle);

	return (
		<>
			<Head>
				<title>{title}</title>
				<meta name="description" content={hook} />
			</Head>

			<Link href={'/'}>
				<a className={styles.back}>{'<- '}GOBACK</a>
			</Link>
			<h1>{title}</h1>
			<h2>{subtitle}</h2>
			<section className={styles.content}>
				<ReactMarkdown
					components={{
						code({ node, className, ...props }) {
							const match = /language-(\w+)/.exec(className || '')
							return match ? (
								<SyntaxHighlighter
									// @ts-ignore
									style={prefersDark ? dark : light}
									language={match?.[1]}
									useInlineStyles={true}
									customStyle={{ borderRadius: '.3rem', border: '1px solid var(--gray-light)' }}
									{...props}
								/>
							) : (
								<SyntaxHighlighter
									// @ts-ignore
									style={prefersDark ? dark : light}
									language={'md'}
									useInlineStyles={true}
									PreTag={'span'}
									customStyle={{ display: 'inline', padding: '.1rem .4rem', borderRadius: '.3rem', border: '1px solid var(--gray-light)' }}
									{...props}
								/>
							)
						}
					}}
				>
					{content}
				</ReactMarkdown>
			</section>

		</>
	)
}

export default Article
