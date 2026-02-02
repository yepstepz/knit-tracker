import { createFormContext } from '@mantine/form';
import type { LogPhoto } from '@/types';

type LogEntryFormValues = {
  title: string;
  happenedAt?: string;
  contentMd: string;
  photo?: LogPhoto | null;
};

// You can give context variables any name
const [FormProvider, useFormContext, useForm] = createFormContext<LogEntryFormValues>();

export { FormProvider, useFormContext, useForm };
