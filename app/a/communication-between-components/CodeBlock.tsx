'use client';

import React from 'react';
import { CH } from '@code-hike/mdx/components';

import { MDXRemote } from 'next-mdx-remote';
import { ComponentProps } from 'react';

export default function CodeBlock(props: ComponentProps<typeof MDXRemote>) {
	console.log(props);
	return <MDXRemote {...props} components={{ CH }} />;
}
