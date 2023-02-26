import { PropsWithChildren } from 'react';
import styles from './Footer.module.scss';
import GithubIcon from '~/components/GithubIcon';

const Footer = ({ children }: PropsWithChildren) => {
	return (
		<footer className={styles.footer}>
			{children}
			<a href="https://github.com/Sam-Apostel" target="_blank" rel="noopener noreferrer">
				<GithubIcon />
				<b>Sam Apostel</b>
			</a>
		</footer>
	);
};

export default Footer;
