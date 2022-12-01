import type { GetStaticProps, NextPage } from 'next'
import styles from '../styles/Home.module.scss'
import { getAllArticles } from '../firebase/firebase';
import { deserializeArticle, SerializedArticle } from '../firebase/types';
import Card from '../components/Article/Card';
import Footer from '../components/Footer/Footer';

type Props = {
	articles: SerializedArticle[]
};
export const getStaticProps: GetStaticProps<Props> = async () => {
	const articles = await getAllArticles()
	return {
		props: {
			articles
		},
	}
}

const Home: NextPage<Props> = ({ articles }) => {
	const lures = [
		'README',
		'more',
		'continue reading',
		'...',
	];

	return (
		<>
			<main>
				<section>
					<h1>Blog</h1>
					{articles.map(deserializeArticle).map((article, i) => (
						<Card key={article.slug} {...article} lure={lures[i % lures.length]} />
					))}
				</section>
				<section>
					<h1>In progress</h1>
					<p>I have so many projects that I want to work on. These are some of my personal projects that are on my mind right now.</p>
					<p>WARNING: These projects are all still under development and not optimised for production use. Some stuff will outright not work.</p>
					{/*<article className={styles.project}>*/}
					{/*	<h2>Polar slicer</h2>*/}
					{/*	<p>Bring your own code, open source, Polar web-slicer/tool path generator thingymagic. Big plans, little time & a lot of complexity.</p>*/}
					{/*	<a className={styles.visit} href="https://slicer.sams.land">visit{' ->'}</a>*/}
					{/*</article>*/}
					{/*<article className={styles.project}>*/}
					{/*	<h2>Home of hope</h2>*/}
					{/*	<p>My girlfriend&apos;s own nook on the www. Go there if you like poetry.</p>*/}
					{/*	<a className={styles.visit} href="https://hope.tigrr.be">visit{' ->'}</a>*/}
					{/*</article>*/}
					{/*<article className={styles.project}>*/}
					{/*	<h2>This blog</h2>*/}
					{/*	<p>Whelp. This is meta. This blog was build in one evening. Should I write a blogpost about creating this blog?</p>*/}
					{/*</article>*/}
					{/*<article className={styles.project}>*/}
					{/*	<h2>3D browser</h2>*/}
					{/*	<p>A page to view my 3D models, designed to be 3D printed.</p>*/}
					{/*	<a className={styles.visit} href="https://3d.sams.land">visit{' ->'}</a>*/}
					{/*</article>*/}
					{/*<article className={styles.project}>*/}
					{/*	<h2>Footprints garden</h2>*/}
					{/*	<p>Tools and things I do. A collection for personal use. Build using a single dependency: Bun</p>*/}
					{/*	<a className={styles.visit} href="https://footprints.garden">visit{' ->'}</a>*/}
					{/*</article>*/}
					<article className={styles.project}>
						<h2>Christmas wishlist</h2>
						<p>I make a new wishlist website every year. Different features, technologies and gimmicks.</p>
						<a className={styles.visit} href="https://kerst.sams.land">visit{' ->'}</a>
					</article>
					<article className={styles.project}>
						<h2>Everything Next 13 Server components</h2>
						<p>Different levels of explaining what server components are and patterns for using them.</p>
					</article>
					<article className={styles.project}>
						<h2>Mortgage simulator</h2>
						<p>A spreadsheet for visualizing and calculating mortgage options.</p>
					</article>
				</section>
				{/*<Subscribe />*/}
			</main>
			<Footer />
		</>
	);
}

export default Home
