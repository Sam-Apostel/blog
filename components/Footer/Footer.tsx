import styles from './Footer.module.scss';

const Footer = () => {
	return (
		<footer className={styles.footer}>
			{/*<a*/}
			{/*	href="https://sams.works/"*/}
			{/*	target="_blank"*/}
			{/*	rel="noopener noreferrer"*/}
			{/*>*/}
			{/*	Portfolio*/}
			{/*</a>*/}
			<a
				href="https://github.com/Sam-Apostel"
				target="_blank"
				rel="noopener noreferrer"
			>
				By <b>Sam Apostel</b>
			</a>
		</footer>
	);
};

export default Footer;