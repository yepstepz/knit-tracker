import { useForm } from './form-context';
import { LogEntry } from '@/types';

export const logEntryForm = (logEntry: Partial<LogEntry>) => {
  return useForm({
    mode: 'controlled',
    initialValues: {
      title: logEntry.title ?? '',
      happenedAt: logEntry.happenedAt ?? undefined,
      contentMd: logEntry.contentMd ?? '',
      photo: logEntry.photo ?? { uri: '', caption: '', alt: '' },
    },
    transformValues: (values) => ({
      ...values,
      happenedAt: values.happenedAt?.length ? values.happenedAt : undefined,
    }),
    validate: {
      title: (v) => (v.trim() ? null : 'Title is required'),
    },
  });
};
