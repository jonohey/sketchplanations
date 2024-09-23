import classNames from "classnames";
import { motion } from "framer-motion";
import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { RemoveScroll } from "react-remove-scroll";

import styles from "./Header.module.css";

import GradientBlur from "components/GradientBlur";
import Navigation from "components/Navigation";
import useSearch from "hooks/useSearch";

import Context from "context";
import Cards from "./Cards";
import KeyboardShortcut from "./KeyboardShortcut";

const Header = () => {
	const router = useRouter();
	const { decorationHidden } = useContext(Context);
	const [isOpen, setIsOpen] = useState(false);

	const { isSearchPage } = useSearch();

	const enterSearch = () => {
		router.push("/search", undefined, { shallow: true });
	};

	useHotkeys("/", (e) => {
		e.preventDefault();
		enterSearch();
	});

	useEffect(() => {
		const handleRouteChange = () => setIsOpen(false);

		router.events.on("routeChangeStart", handleRouteChange);

		return () => {
			router.events.off("routeChangeStart", handleRouteChange);
		};
	}, [router]);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	const variants = {
		visible: {
			y: 0,
			transition: { duration: 0.1 },
		},
		hidden: {
			y: "-100%",
			transition: { duration: 0.3 },
		},
	};

	return (
		<RemoveScroll enabled={isOpen} className="sticky top-0 z-10">
			<motion.div
				variants={variants}
				initial="visible"
				animate={decorationHidden ? "hidden" : "visible"}
				className={classNames(styles.root, isOpen && styles["root--is-open"])}
			>
				<button
					type="button"
					className={styles.menu}
					onClick={() => setIsOpen(!isOpen)}
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
						>
							<span className={styles["search-toggle-button__icon"]}>
								<Search strokeWidth={1} size={22} />
							</span>
							<span className={styles["search-toggle-button__text"]}>
								Search…
							</span>
							{/* <kbd
								className={styles["search-toggle-button__keyboard-shortcut"]}
							>
								/
							</kbd> */}
							<KeyboardShortcut shortcut="/" />
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
			</motion.div>
			<div className="absolute w-full">
				<GradientBlur height={1.5} easing="cubic-bezier(0.7, 0, 0.84, 0)" />
			</div>
		</RemoveScroll>
	);
};

export default Header;
