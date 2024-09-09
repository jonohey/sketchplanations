import { default as NextLink } from "next/link";

const Link = ({ href, children, className, ...props }) => {
	return (
		<NextLink href={href} className={className} {...props}>
			{children}
		</NextLink>
	);
};

export default Link;
