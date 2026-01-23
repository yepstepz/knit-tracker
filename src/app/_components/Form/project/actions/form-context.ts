import { createFormContext } from '@mantine/form';

// You can give context variables any name
const [FormProvider, useFormContext, useForm] = createFormContext();

export { FormProvider, useFormContext, useForm };
