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
 * just await this function where it will be executed and you can update the data
 */
const editArticle = () => {
	updateArticle('equals-does-not-float', {
		content: `Hi!
I'm new here and I guess so are you.
I am one of those developers with tons of ideas and no time to bring them all to life; who starts working on each and every one of these ideas barely finishing any.

With this blog I hope to focus myself on finishing some of my most interesting ideas and sharing what I learn along the way.

### Trigger
Yesterday my new employer filled out their [about us](https://spatie.be/about-us) section with my information.

🎉 Yay 🎉

Unsurprisingly they had linked one of my unfinished projects as "my website".

"I should finish this website right now!" - washed over me as I went to my (endless) folder of unfinished projects. Some other projects drew my eye and my brain got excited again.

That's how I made some big steps in the technical redesign of [my girlfriend's webshop](https://hope.tigrr.be).

### First time?
As I was converting an old JavaScript webcomponent codebase to Next.js with typescript I  copied the server function that communicated the order to the payment provider.

\`\`\`
ERROR: Total amount (€35.49) does not match the cumulative price of the items in this order (€35.48).
\`\`\`

I quickly spotted the one cent difference and started looking for my code that converted numbers into currency.

\`\`\`ts
const toCurrency = (amount: number) => {
\treturn {
\t\tcurrency: 'EUR',
\t\tvalue: toDoubleDecimalString(amount)
\t}
};

const toDoubleDecimalString = (value: number) => {
\tconst e2 = \`\${Math.floor(value * 100)}\`;
\tif(e2 === '0') return '0.00';
\tif(e2.length === 1) return \`0.0\${value}\`;
\tif(e2.length === 2) return \`0.\${value}\`;
\treturn \`\${e2.slice(0, e2.length - 2)}.\${e2.slice(e2.length - 2)}\`;
};
\`\`\`

Did you spot it?

I floored a floating point number and it broke my payment flow when people ordered an amount of an item...
Since I wasn't expecting anything more specific than one cent I could fix this with \`Math.round\`.

That's where I learned my lesson and never made any floating point errors ever again.

Right?

After publishing the webshop I moved on to one of my favorite projects on the list, a javascript [3D toolpath generator](https://slicer.sams.land) for my polar 3D printer.

## Hours of debugging
Picking this project up I started by importing some new models to test with and found a big list of problems in no time. Tracking down where my code went wrong was orders of magnitude more dificult.

One of the critical parts of the slicer was converting a set of edges into a set of continuous shapes; matching the end vertex of an edge to another edge – a slice. the slicer kept generating multiple open shapes in very specific cases and it took me hours of debugging to  rediscover that I was working with an aproximate numbering system.

The implementation of my new \`equals\` function uses an arbitrarily small number as a tolerance and suddenly half of my problems were solved.

– For the first time since I picked up JavaScript, I would love to have python's \`__eq__\` now.

\`\`\`ts
const TOLERANCE = 0.00000001;
const equalsWithTolerance = (a: number, b: number, tolerance = TOLERANCE) =>
\tMath.abs(a - b) < tolerance;
\`\`\`


## Pick perfect precisions
The arbitrarily chosen tolerance in \`equalsWithTolerance\` didn't only match vertices but also ran a calculation that removes vertices that lay in the middle of straight lines. Upon closer inspection, the tolerance needed was exponentially higher than the one I had been using.

## Conclusion
Try to make a concious decision on the tolerance needed when working with floating point number, figure out what happens in each function with tiny margins of error and tolerate them accordingly.

Reading my old code made my happy with the strides I took the last 2.5 years of coding professionally. I now look to the future knowing there will always be stuff lined up for me to learn about and share.`
	});
}






