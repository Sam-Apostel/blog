import styles from './Card.module.scss';
import Link from 'next/link';
import { Article } from '../../firebase/types';
import Date from '../Date';

type Props = Article & {
	lure: string;
};

const Card = ({ title, subtitle, hook, slug, lure, published }: Props) => {
	return (
		<article className={styles.article}>
			<h2>{title}</h2>
			{subtitle && <h3>{subtitle}</h3>}
			<p>{hook}</p>
			<div className={styles.bottom}>
				<Date date={published} />
				<Link
					href={{
						pathname: '/[slug]',
						query: { slug: slug }
					}}
				>
					<a>{lure}{' ->'}</a>
				</Link>
			</div>
		</article>
	);
};

export default Card;
