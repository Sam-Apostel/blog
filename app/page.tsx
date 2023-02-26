import Card from '~/components/Article/Card';
import { getXataClient } from '~/globals/db';

const xata = getXataClient();

export default async function Home() {
	const articles = await xata.db.blogposts
		.filter({ published: { $lt: new Date() } })
		.sort('published', 'desc')
		.getAll();

	const lures = ['README', 'more', 'continue reading', '...'];

	return (
		<main>
			<h1>Sam Apostel</h1>
			<section>
				<h2>Articles</h2>
				{articles.map((article, i) => (
					<Card key={article.id} {...article} lure={lures[i % lures.length]} />
				))}
			</section>
			{/*<Subscribe />*/}
		</main>
	);
}
