const KeyboardShortcut = ({ shortcut, icon }) => {
	return (
		<kbd className="inline-flex items-center justify-center text-xs bg-bgKeyboardShortcut border border-borderKeyboardShortcut rounded-md text-textSubdued w-6 aspect-square">
			{icon || shortcut}
		</kbd>
	);
};

export default KeyboardShortcut;
