import { WIGCompletionIndicator } from './WIGCompletionIndicator';
import { WIGSidenavHeader } from './WIGSidenavHeader';
import { WIGSidenavManagement } from './WIGSidenavManagement';

import { ProgressBar } from 'primereact/progressbar';
import { WIG } from 'server/src/wig/domain/models/WIG';

// TODO: translate and finish components
export type WIGSidenavProps = {
	wig: WIG;
};

export const WIGSidenav = (props: WIGSidenavProps) => {
	const { wig } = props;
	const wigId = wig.id;
	return (
		<div className="flex flex-column gap-4">
			<WIGCompletionIndicator wig={wig} />
			<WIGSidenavManagement wigId={wigId} />
			{/* <WIGSidenavCommitment />*/}
		</div>
	);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const WIGSidenavCommitment = () => {
	return (
		<div>
			<WIGSidenavHeader title="Commitment" subtitle="Last Month" />
			<div className="flex flex-row align-items-center">
				<span
					className="col-6"
					style={{
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
					}}
				>
					Amy Elsnerasdasdasdasdasda
				</span>
				<ProgressBar className="col-6 p-0" value={75} />
			</div>
			<div className="flex flex-row align-items-center">
				<span
					className="col-6"
					style={{
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
					}}
				>
					Amy Elsner
				</span>
				<ProgressBar className="col-6 p-0 mr-2" value={67} color="var(--green-500)" />
			</div>
			<div className="flex flex-row align-items-center">
				<span
					className="col-6"
					style={{
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
					}}
				>
					Amy Elsner
				</span>
				<ProgressBar className="col-6 p-0 mr-2" value={35} color="var(--red-500)" />
			</div>
			<div className="flex flex-row align-items-center">
				<span
					className="col-6"
					style={{
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
					}}
				>
					Amy Elsner
				</span>
				<ProgressBar className="col-6 p-0 mr-2" value={40} color="var(--orange-500)" />
			</div>
			<div className="flex flex-row justify-content-end pt-2">
				<span className="text-primary">Add commit</span>
			</div>
		</div>
	);
};
