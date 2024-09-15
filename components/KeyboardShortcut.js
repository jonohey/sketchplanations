const KeyboardShortcut = ({ shortcut, icon }) => {
	return (
		<span className="inline-flex items-center justify-center text-xs bg-bgKeyboardShortcut border border-border rounded-md text-textSubdued w-6 aspect-square">
			{icon || shortcut}
		</span>
	);
};

export default KeyboardShortcut;
