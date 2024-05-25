import ArticleCard from '~/components/Article/Card';
import ProjectCard from '~/components/Project/Card';
import { getXataClient } from '~/globals/db';
import styles from './Home.module.scss';

const xata = getXataClient();

export default async function Home() {
	const articles = await xata.db.blogpost
		.filter({ published: { $lt: new Date() } })
		.sort('published', 'desc')
		.getAll();

	const projects = await xata.db.project.filter({ published: true }).sort('xata.updatedAt', 'desc').getAll();

	const lures = ['README', 'more', 'continue reading', '...'];

	return (
		<main>
			<h1>Sam Apostel</h1>
			<section>
				<h2>Articles</h2>
				{articles.map((article, i) => (
					<ArticleCard key={article.id} {...article} lure={lures[i % lures.length]} />
				))}
			</section>
			<section>
				<h2>Projects</h2>
				<p>I'm always starting new projects. Here are some of the things I have been working on.</p>
				<div className={styles.projects}>
					{projects.map((project, i) => (
						<ProjectCard key={project.id} {...project} />
					))}
				</div>
			</section>
			{/*<Subscribe />*/}
		</main>
	);
}
