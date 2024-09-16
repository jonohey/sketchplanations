import classNames from "classnames";
import Link from "next/link";
import { useState } from "react";
import { RoughNotation } from "react-rough-notation";

const FancyLink = ({
	as = Link,
	href,
	children,
	className,
	active = false,
	...props
}) => {
	const [show, setShow] = useState(false);

	const Component = as;

	return (
		<Component
			{...props}
			className={classNames("text-blue", className)}
			href={href}
			onMouseEnter={() => setShow(true)}
			onMouseLeave={() => setShow(false)}
		>
			<RoughNotation
				show={active ? true : show}
				animate={false}
				iterations={1}
				// animationDuration={150}
				// animationDelay={100}
				strokeWidth={1}
				multiline
				padding={3}
				color="var(--color-blue)"
			>
				{children}
			</RoughNotation>
		</Component>
	);
};

export default FancyLink;
