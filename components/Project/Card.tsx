import styles from './Card.module.scss';
import Link from 'next/link';
import { Project } from '~/globals/db';
import LinkIcon from '../icons/LinkIcon';

type Props = Project;

const Card = ({ name, description, slug, url, showUrl, dedicatedPage }: Props) => {
	return (
		<article className={styles.article} aria-describedby={`${slug}_hook`}>
			<div className={styles.header}>
				<h3>{name}</h3>
				{url &&
					(showUrl ? (
						<a className={styles.projectLink} href={url}>
							{url.replace('https://', '')}
						</a>
					) : (
						<a className={styles.projectLink} href={url}>
							view
							<LinkIcon />
						</a>
					))}

				{dedicatedPage && (
					<Link className={styles.projectLink} href={`/p/${slug}`}>
						more <span>{' ->'}</span>
					</Link>
				)}
			</div>
			<p id={`${slug}_hook`}>{description}</p>
		</article>
	);
};

export default Card;
