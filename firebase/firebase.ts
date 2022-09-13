import admin from 'firebase-admin';
import { Article, ARTICLE_FIELDS, DIRECTION, FilterOp, FirebaseArticle, serializeArticle } from './types';

try {
	admin.initializeApp({
		credential: admin.credential.cert({
			projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
			privateKey: process.env.FIREBASE_PRIVATE_KEY,
			clientEmail: process.env.FIREBASE_CLIENT_EMAIL
		}),
		databaseURL: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_DB_URL
	});
} catch (error) {
	if ((error instanceof Error) && !/already exists/u.test(error.message)) {
		// eslint-disable-next-line no-console
		console.error('Firebase admin initialization error', error.stack);
	}
}

export const firestore = admin.firestore();
const articles = firestore.collection('articles');


export const getAllArticleSlugs = async () => {
	const { docs } = await articles.get();
	return docs.map(doc => doc.id);
};

export const getAllArticles = async () => {
	const { docs } = await articles
		.where(ARTICLE_FIELDS.Published, FilterOp.IsSmallerThan, new Date())
		.orderBy(ARTICLE_FIELDS.Published, DIRECTION.Desc)
		.get();
	return Promise.all(docs.map(async doc => {
		const data = await doc.data() as FirebaseArticle;
		return serializeArticle(data, doc.id);
	}))
};

export const getArticle = async (slug: string) => {
	const doc = await articles.doc(slug).get();
	if (!doc.exists) throw new Error(`Article with slug \`${slug}\` was not found.`);
	const data = await doc.data() as FirebaseArticle;
	return serializeArticle(data, doc.id);
};

const updateArticle = (slug: string, newData: Partial<Article>) => {
	return articles.doc(slug).update(newData);
}

/**
 * just await this function where it will be executed, and you can update the data.
 */
const editArticle = async () => {
	// const article = await require('../articles/you-might-not-need-useref-for-that.md').default;

	return updateArticle('you-might-not-need-useref-for-that', {
		// content: article
	});
}

// editArticle();
