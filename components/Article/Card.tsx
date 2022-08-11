import styles from './Card.module.scss';
import Link from 'next/link';
import { Article } from '../../firebase/types';

type Props = Article & {
	lure: string;
};

const Card = ({ title, subtitle, hook, slug, lure }: Props) => {
	return (
		<article className={styles.article}>
			<h2>{title}</h2>
			<h3>{subtitle}</h3>
			<p>{hook}</p>
			<Link
				href={{
					pathname: '/[slug]',
					query: { slug: slug }
				}}
			>
				<a className={styles.more}>{lure}{' ->'}</a>
			</Link>
		</article>
	);
};

export default Card;
