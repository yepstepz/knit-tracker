import { LogEntry } from '@/types';

export const emptyLogEntry: Partial<LogEntry> = {
  happenedAt: undefined,
  title: '',
  contentMd: '',
  photo: { uri: '', caption: '', alt: '' },
};
