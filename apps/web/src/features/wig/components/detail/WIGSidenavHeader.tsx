export type WIGSidenavHeaderProps = {
	title?: string;
	subtitle?: string;
};

export const WIGSidenavHeader = (props: WIGSidenavHeaderProps) => {
	const { title, subtitle } = props;
	return (
		<div className="flex flex-column">
			{title && <span className="text-lg font-bold m-2">{title}</span>}
			{subtitle && <div className="text-400 col-12 pt-0 pb-3">{subtitle}</div>}
		</div>
	);
};
