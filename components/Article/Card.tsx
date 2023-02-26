import styles from './Card.module.scss';
import Link from 'next/link';
import Date from '../Date';
import { Blogpost } from '~/globals/db';

type Props = Blogpost & {
	lure: string;
};

const Card = ({ title, hook, slug, lure, published, cover }: Props) => {
	return (
		<article className={styles.article} aria-describedby={`${slug}_hook`}>
			{cover && (
				<div className={styles.image}>
					<img src={cover} />
				</div>
			)}
			<div className={styles.textContent}>
				<h3>{title}</h3>
				<p id={`${slug}_hook`}>{hook}</p>
				<footer className={styles.bottom}>
					<Date date={published} className={styles.date} />
					<Link href={`/a/${slug}`}>
						{lure}
						{' ->'}
					</Link>
				</footer>
			</div>
		</article>
	);
};

export default Card;
