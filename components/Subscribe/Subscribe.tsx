import styles from './Subscribe.module.scss';

const Subscribe = () => {
	return (
		<section className={styles.subscribe}>
			<h2>Subscribe</h2>
			<main>
				<form className={styles.mail} action={'/subscribe'} method={'POST'}>
					<label>
						<span>e-mail</span>
						<input id="email" name="email" type="email" />
					</label>
					<input type="submit" className={styles.cta} value="Get emails" />
				</form>
				<section>
					<a className={styles.buttonLink} href="/rss.xml">RSS</a>
					<button className={styles.button}>Push notifications</button>
				</section>
			</main>
		</section>
	);
};

export default Subscribe;
