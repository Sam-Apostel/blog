import styles from './Card.module.scss';
import Link from 'next/link';
import { Project } from '~/globals/db';
import LinkIcon from '../LinkIcon';

type Props = Project

const Card = ({ name, description, slug, url, showUrl, dedicatedPage }: Props) => {
	return (
		<article className={styles.article} aria-describedby={`${slug}_hook`}>
			{url && (showUrl 
					? <a className={styles.projectLink} href={url}>{url.replace('https://', '')}</a> 
					: <a className={styles.projectLink} href={url}>view<LinkIcon /></a>
				)}
			{dedicatedPage && (<Link  href={`/p/${slug}`}>
				<Content 
					name={name}
					url={url}
					showUrl={showUrl}
					slug={slug}
					description={description}
				/>
			</Link>)}
			{!dedicatedPage && (
				<Content 
					name={name}
					url={url}
					showUrl={showUrl}
					slug={slug}
					description={description}
				/>
			)}
			
			
		</article>
	);
};

function Content({ name, url, showUrl, slug, description }: { 
	name: string,
	url?: string | null,
	showUrl: boolean,
	slug: string, 
	description: string
}) {
	return (
		<>
			<div className={styles.header}>
				<h3>{name}</h3>
				{url && (showUrl 
				? <span className={styles.projectLinkPlaceholder}>{url.replace('https://', '')}</span> 
				: <span className={styles.projectLinkPlaceholder}>view<LinkIcon /></span>
			)}
				
			</div>
			<p id={`${slug}_hook`}>{description}</p>
		</>
	)
}

export default Card;
