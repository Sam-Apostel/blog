import { firestore } from 'firebase-admin';
import OrderByDirection = firestore.OrderByDirection;
import { Timestamp, WhereFilterOp } from '@firebase/firestore';

export type FirebaseArticle = {
	title: string;
	subtitle: string;
	hook: string;
	content: string;
	published: Timestamp;
}

export type Article = {
	title: string;
	subtitle: string;
	hook: string;
	content: string;
	published: Date;
	slug: string;
}

export type SerializedArticle = {
	title: string;
	subtitle: string;
	hook: string;
	content: string;
	published: string;
	slug: string;
}

export const serializeArticle = ({ published, ...article }: FirebaseArticle, slug: string): SerializedArticle => {
	console.log(published);
	return {
		...article,
		published: published.toDate().toJSON(),
		slug
	}
}

export const deserializeArticle = ({ published, ...article }: SerializedArticle): Article => {
	return {
		...article,
		published: new Date(published),
	}
}

export const DIRECTION: Record<string, OrderByDirection> = {
	Asc: 'asc',
	Desc: 'desc'
}

export const FilterOp: Record<string, WhereFilterOp> = {
	IsSmallerThan: '<',
	IsSmallerOrEqualsTo: '<=',
	Equals: '==',
	NotEquals: '!=',
	EqualsOrIsBiggerThan: '>=',
	IsBiggerThan: '>',
	Contains: 'array-contains',
	In: 'in',
	NotIn: 'not-in',
	ContainsAny: 'array-contains-any',
}

export const ARTICLE_FIELDS: Record<string, keyof Article> = {
	Title: 'title',
	Subtitle: 'subtitle',
	Hook: 'hook',
	Content: 'content',
	Published: 'published',
}


