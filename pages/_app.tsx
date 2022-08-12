import '../styles/globals.scss'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import Layout from '../components/Layout/Layout';
import { GoogleAnalytics, usePageViews, event } from 'nextjs-google-analytics';

export function reportWebVitals({ id, name, label, value }: NextWebVitalsMetric) {
	event(name, {
		category: label === "web-vital" ? "Web Vitals" : "Next.js custom metric",
		value: Math.round(name === "CLS" ? value * 1000 : value), // values must be integers
		label: id, // id unique to current page load
		nonInteraction: true, // avoids affecting bounce rate.
	});
}

const App = ({ Component, pageProps }: AppProps) => {
	usePageViews();

	return (
		<>
			<GoogleAnalytics />
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</>
	);
};

export default App
