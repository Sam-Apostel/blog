import ArticleCard from '~/components/Article/Card';
import ProjectCard from '~/components/Project/Card';
import { desc, eq, lt } from 'drizzle-orm';
import { db } from '~/globals/db';
import { blogpost, project } from '~/globals/schema';
import styles from './Home.module.scss';

export const dynamic = 'force-dynamic';

export default async function Home() {
	const articles = await db
		.select()
		.from(blogpost)
		.where(lt(blogpost.published, new Date()))
		.orderBy(desc(blogpost.published));

	const projects = await db
		.select()
		.from(project)
		.where(eq(project.published, true))
		.orderBy(desc(project.updatedAt));

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
					{projects.map((project) => (
						<ProjectCard key={project.id} {...project} />
					))}
				</div>
			</section>
			{/*<Subscribe />*/}
		</main>
	);
}
