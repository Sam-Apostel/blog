import { getRssXml } from '../RSS/rssHelper';
import { GetServerSideProps, GetStaticProps } from 'next';
import { getAllArticles } from '../firebase/firebase';

// @ts-ignore
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
	if (!res) {
		return;
	}
	const articles = await getAllArticles();
	res.setHeader("Content-Type", "text/xml");
	res.write(getRssXml(articles));
	res.end();

	return ({ props: {} });
}

export default function Rss() {
	return null;
}


