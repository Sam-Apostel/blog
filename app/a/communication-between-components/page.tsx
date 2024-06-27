import styles from './Article.module.scss';
import '@code-hike/mdx/dist/index.css';
import { serialize } from 'next-mdx-remote/serialize';
import { remarkCodeHike } from '@code-hike/mdx';

import Link from 'next/link';

import DateTime from '~/components/Date';
import { getXataClient, Blogpost } from '~/globals/db';

import Markdown from '~/components/Markdown/Markdown';
import CodeBlock from './CodeBlock';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

const xata = getXataClient();

type PublishedBlogPost = Omit<Blogpost, 'published'> & { published: Date };
const slug = 'communication-between-components';

function isPublished(post: Blogpost): post is PublishedBlogPost {
	if (!post.published) return false;
	return post.published <= new Date();
}

export default async function Article() {
	const post = (await xata.db.blogpost
		.filter({
			$all: [{ slug }, { published: { $lt: new Date() } }],
		})
		.getFirst()) as Blogpost | null;

	if (!post) notFound();
	if (!isPublished(post)) notFound();

	const { content, published } = post;

	const source = `
## Example

<CH.Scrollycoding>

This is a very common piece of code that shares some state with multiple child components

\`\`\` tsx index.tsx
function Main() {
    const [value, setValue] = useState<Value>();

    return (
        <Page>
            <Sidebar
                value={value} 
                setValue={setValue}
            />
            <Renderer value={value} />
        </Page>
    );
}

type ValueProps = { 
    value: Value;
    setValue: Dispatch<SetStateAction<Value>>;
};

function Sidebar({ value, setValue }: ValueProps) {
    return (
        <Input 
            value={value} 
            onChange={setValue} 
        />
    );
}
\`\`\`

---

The way state is passed through is called **prop drilling**.

\`\`\` tsx index.tsx
function Main() {
    // focus
    const [value, setValue] = useState<Value>();

    return (
        <Page>
            <Sidebar
                // focus(1:2)
                value={value} 
                setValue={setValue}
            />
            <Renderer value={value} />
        </Page>
    );
}

// focus(1:4)
type ValueProps = { 
    value: Value;
    setValue: Dispatch<SetStateAction<Value>>;
};

// focus(1[18:48])
function Sidebar({ value, setValue }: ValueProps) {
    return (
        <Input 
            // focus(1:2)
            value={value} 
            onChange={setValue} 
        />
    );
}
\`\`\`

---
Use react **context** to make the state accessible to components down the tree. 

\`\`\` tsx index.tsx
// focus
const ValueContext = createContext<[Value, Dispatch<SetStateAction<Value>>]>();

function Main() {
    const [value, setValue] = useState<Value>();

    return (
        <Page>
            // focus(1,4)
            <ValueContext.Provider value={[value, setValue]}>
                <Sidebar />
                <Renderer value={value} />
            </ValueContext.Provider>
        </Page>
    );
}

function Sidebar() {
    // focus
    const [value, setValue] = useContext(ValueContext);

    return (
        <Input 
            value={value} 
            onChange={setValue} 
        />
    );
}
\`\`\`


---
Create a **dedicated provider and components** that consume your context. This will make your state reusable across your application.

\`\`\` tsx index.tsx
const ValueContext = createContext<[Value, Dispatch<SetStateAction<Value>>]>();

// focus(1:5)
function ValueProvider({ children }: PropsWithChildren){
    const [value, setValue] = useState<Value>();

    return <ValueContext.Provider children={children} />;
}

function Main() {
    return (
        <Page>
            // focus(1,3:4)
            <ValueProvider>
                <Sidebar />
                <ValueRenderer />
            </ValueProvider>
        </Page>
    );
}

function Sidebar() {
    const [value, setValue] = useContext(ValueContext);

    return (
        <Input 
            value={value} 
            onChange={setValue} 
        />
    );
}
\`\`\`

---

Then add **dedicated components** to consume your provider

\`\`\` tsx index.tsx
const ValueContext = createContext<[Value, Dispatch<SetStateAction<Value>>]>();

function ValueProvider({ children }: PropsWithChildren){
    const [value, setValue] = useState<Value>();

    return <ValueContext.Provider children={children} />;
}

function Main() {
    return (
        <Page>
            <ValueProvider>
                <Sidebar />
                <ValueRenderer />
            </ValueProvider>
        </Page>
    );
}

function Sidebar() {
    return (
// focus
        <ValueInput />
    );
}
\`\`\`
</CH.Scrollycoding>

## Result
<CH.Code>
\`\`\` tsx index.tsx
function Main() {
    return (
        <Page>
            <ValueProvider>
                <Sidebar />
                <ValueRenderer />
            </ValueProvider>
        </Page>
    );
}

function Sidebar() {
    return (
        <ValueInput />
    );
}
\`\`\`

\`\`\` tsx valueContext.tsx
type ValueState = ReturnType<typeof useState<Value>>;
const ValueContext = createContext<ValueState>();

export function ValueProvider({ children }: PropsWithChildren){
    const [value, setValue] = useState<Value>();

    return <ValueContext.Provider children={children} />;
}

export function useValueState() {
    return useContext(ValueContext);
}

export ValueRenderer() {
    const [value] = useValueState();

    return <Renderer value={value} />;
}

export ValueInput() {
    const [value, setValue] = useValueState();

    return <Input value={value} onChange={setValue} />;
}
\`\`\`
</CH.Code>
The dedicated provider and the named hooks is where you would move any logic related to how this state can update and any side effects that should happen. This brings together all related logic in instead of sprinkling multiple flows through each other.
`;
	const mdxSource = await serialize(source, {
		mdxOptions: {
			remarkPlugins: [
				[
					remarkCodeHike,
					{
						autoImport: false,
						theme: 'material-default',
					},
				],
			],
			useDynamicImport: true,
		},
	});

	return (
		<main>
			<DateTime date={published} className={styles.published} />
			<Link href="../../" className={styles.back}>
				{'<- '}GOBACK
			</Link>
			<article className={styles.content}>
				<Markdown>{content}</Markdown>
				<CodeBlock {...mdxSource} />
			</article>
		</main>
	);
}

export async function generateMetadata(): Promise<Metadata> {
	const post = (await xata.db.blogpost
		.filter({
			$all: [{ slug }],
		})
		.getFirst()) as Blogpost | null;

	if (!post) notFound();
	if (!isPublished(post)) notFound();

	const { title, hook, canonical, keywords, published } = post;

	return {
		title: title,
		description: hook,
		alternates: {
			canonical: canonical ?? `https://sams.land/a/${slug}`,
		},
		keywords: ['React', 'JavaScript', 'Blog', 'Personal', 'Sam Apostel', ...(keywords ?? [])],
		openGraph: {
			title: `${title} | Sam Apostel`,
			description: hook,
			url: `https://sams.land/a/${slug}`,
			siteName: 'sams.land',
			images: [
				{
					url: `https://sams.land/a/${slug}/facebook.png`,
					width: 1800,
					height: 1600,
				},
			],
			locale: 'en-US',
			type: 'article',
			publishedTime: published.toISOString(),
			authors: 'Sam Apostel',
			tags: ['React', 'JavaScript', 'Blog', 'Personal', 'Sam Apostel', ...(keywords ?? [])],
		},
		twitter: {
			card: 'summary_large_image',
			title: title,
			description: hook,
			creator: '@sam_apostel',
			images: [`https://sams.land/a/${slug}/twitter.png`],
		},
	};
}
