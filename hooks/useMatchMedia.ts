import { useEffect, useState } from 'react';

const useMatchMedia = (media: string, ) => {
	const [matches, setMatches] = useState<boolean>();

	useEffect(() => {
		const match = window.matchMedia(media);
		setMatches(match.matches);
		match.addEventListener('change', e => setMatches(e.matches));
		return match.removeEventListener('change', e => setMatches(e.matches));
	}, [media]);

	return matches;
}

export default useMatchMedia;
