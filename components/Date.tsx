const Date = ({ date, ...props }: { date: Date } | Record<string, any>) => {
	const dateFormatter = new Intl.DateTimeFormat('be');

	return (
		<time dateTime={date.toISOString()} {...props}>
			{dateFormatter.format(date)}
		</time>
	);
};

export default Date;
