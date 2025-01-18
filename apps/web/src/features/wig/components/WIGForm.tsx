// WIGForm.tsx
import { InputCalendarControl } from '@/components/forms/controls/InputCalendarControl';
import { InputCheckboxControl } from '@/components/forms/controls/InputCheckboxControl';
import { InputTextControl } from '@/components/forms/controls/InputTextControl';
import { BaseFormHandle, FormMode } from '@/types/forms';

import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useImperativeHandle } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { CreateWIGDTO, CreateWIGDTOSchema } from 'server/src/wig/data/dtos/CreateWIGDTO';
import {
	UpdateGeneralSectionDTO,
	UpdateGeneralSectionSchemaDTOSchema,
} from 'server/src/wig/data/dtos/UpdateGeneralSectionDTO';
import { CreateWIG } from 'server/src/wig/domain/types/CreateWIG';

type WIGFormProps = {
	mode: FormMode;
	values?: CreateWIGDTO | UpdateGeneralSectionDTO;
	onSubmit: (data: CreateWIGDTO | UpdateGeneralSectionDTO) => void;
};

export type WIGFormHandle = BaseFormHandle;

export const WIGForm =
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	forwardRef<WIGFormHandle, WIGFormProps>(({ mode, onSubmit, values }, ref) => {
		const formMethods = useForm<CreateWIG>({
			resolver: zodResolver(mode == 'create' ? CreateWIGDTOSchema : UpdateGeneralSectionSchemaDTOSchema),
			values,
		});
		const { handleSubmit } = formMethods;
		useImperativeHandle(ref, () => ({
			submit: () => {
				handleSubmit(onSubmit)();
			},
		}));

		return (
			<FormProvider {...formMethods}>
				<form>
					<WIGFormLayout />
				</form>
			</FormProvider>
		);
	});

const WIGFormLayout = () => {
	return (
		<div>
			<InputTextControl name="name" label={{ id: 'app.field.name' }} />
			<InputTextControl name="description" label={{ id: 'wig.field.description' }} />
			<InputCalendarControl name="dueDate" label={{ id: 'wig.field.dueDate' }} />
			<InputCheckboxControl name="isOrganizational" label={{ id: 'wig.form.isOrganizational' }} />
		</div>
	);
};
