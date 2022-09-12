import styles from './Layout.module.scss';
import Footer from '../Footer/Footer';
import { PropsWithChildren } from 'react';

const layout = ({ children }: PropsWithChildren) => {
	return (
		<>
			<div className={styles.body}>
				{children}
			</div>
		</>
	);
}

export default layout;
