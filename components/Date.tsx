const Date = ({ date, ...props }: { date: Date } | Record<string, any>) => {

	const dateFormatter = new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' });

	return (
		<time
			dateTime={date.toDateString()}
			{...props}
		>
			{dateFormatter.format(date)}
		</time>
	);
};

export default Date
