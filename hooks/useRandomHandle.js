import { useEffect, useState } from "react";

export const useRandomHandle = (dependencies = []) => {
	const [randomHandle, setRandomHandle] = useState(null);

	useEffect(() => {
		const fetchRandomHandle = async () => {
			try {
				const res = await fetch("/api/random");
				const { handle } = await res.json();
				setRandomHandle(handle);
			} catch (error) {
				console.error(error);
			}
		};

		fetchRandomHandle();
	}, dependencies);

	return randomHandle;
};
