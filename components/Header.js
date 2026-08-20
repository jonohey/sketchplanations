import classNames from "classnames";
import { Menu, Search } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { RemoveScroll } from "react-remove-scroll";

import styles from "./Header.module.css";

import Navigation from "components/Navigation";
import shouldIgnoreShortcut from "helpers/shouldIgnoreShortcut";

import Context from "context";
import Cards from "./Cards";
import KeyboardShortcut from "./KeyboardShortcut";

const GradientBlur = dynamic(() => import("components/GradientBlur"));

const Header = () => {
	const router = useRouter();
	const { decorationHidden } = useContext(Context);
	const [isOpen, setIsOpen] = useState(false);
	const [isDesktop, setIsDesktop] = useState(false);

	const isSearchPage = router.pathname === "/search";

	const enterSearch = () => {
		router.push("/search", undefined, { shallow: true });
	};

	useHotkeys("/", (e) => {
		if (shouldIgnoreShortcut(e)) return;
		e.preventDefault();
		enterSearch();
	}, { useKey: true });

	useHotkeys("f", (e) => {
		if (shouldIgnoreShortcut(e)) return;
		e.preventDefault();
		enterSearch();
	}, { useKey: true });

	useHotkeys("s", (e) => {
		if (shouldIgnoreShortcut(e)) return;
		e.preventDefault();
		enterSearch();
	}, { useKey: true });

	useEffect(() => {
		const handleRouteChange = () => setIsOpen(false);

		router.events.on("routeChangeStart", handleRouteChange);

		return () => {
			router.events.off("routeChangeStart", handleRouteChange);
		};
	}, [router]);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(min-width: 768px)");
		const update = () => setIsDesktop(mediaQuery.matches);
		update();
		mediaQuery.addEventListener("change", update);
		return () => mediaQuery.removeEventListener("change", update);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<RemoveScroll enabled={isOpen} className="sticky top-0 z-10">
			<div
				className={classNames(
					styles.root,
					isOpen && styles["root--is-open"],
					decorationHidden && styles["root--hidden"],
				)}
			>
				<button
					type="button"
					className={styles.menu}
					onClick={() => setIsOpen(!isOpen)}
					aria-label="Toggle navigation menu"
				>
					<Menu />
				</button>
				{router.pathname === "/" ? (
					<div
						onClick={() => {}}
						onKeyUp={scrollToTop}
						className={styles.ident}
						style={{ cursor: "pointer" }}
					>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src="/logo.svg"
							className={styles.ident__svg}
							alt="Sketchplanations"
						/>
					</div>
				) : (
					<Link href="/" className={styles.ident}>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src="/logo.svg"
							className={styles.ident__svg}
							alt="Sketchplanations"
						/>
					</Link>
				)}
				<div className={styles["search-toggle"]}>
					{!isSearchPage && (
						<button
							type="button"
							className={styles["search-toggle-button"]}
							onClick={enterSearch}
							aria-label="Open search"
						>
							<span className={styles["search-toggle-button__icon"]}>
								<Search strokeWidth={1} size={22} />
							</span>
							<span className={styles["search-toggle-button__text"]}>
								Search…
							</span>
							<KeyboardShortcut shortcut="F" />
						</button>
					)}
				</div>
				<div
					className={classNames(
						styles.navigation,
						isOpen && styles["navigation--is-open"],
					)}
				>
					<Navigation />
					<div className={styles.cards}>
						<Cards />
					</div>
				</div>
				<div className={styles.divider} />
				<div className={styles["spacer-left"]} />
				<div className={styles["spacer-right"]} />
			</div>
			{isDesktop && (
				<div className="absolute w-full">
					<GradientBlur height={1.5} easing="cubic-bezier(0.7, 0, 0.84, 0)" />
				</div>
			)}
		</RemoveScroll>
	);
};

export default Header;
