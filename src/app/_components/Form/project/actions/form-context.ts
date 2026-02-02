import { createFormContext } from '@mantine/form';
import type { ProjectFormValues } from '@/app/_components/Form/project/types';

// You can give context variables any name
const [FormProvider, useFormContext, useForm] = createFormContext<ProjectFormValues>();

export { FormProvider, useFormContext, useForm };
