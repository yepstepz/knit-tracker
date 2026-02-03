import type { UseFormReturnType } from '@mantine/form';
import type { LogPhoto } from '@/types';

export type ImageValue = {
  id?: string;
  uri?: string;
  caption?: string;
  alt?: string;
  role?: 'COVER' | 'GALLERY';
};

export type ImageFieldProjectValues = {
  cover: ImageValue;
  photos?: ImageValue[];
};

export type ImageFieldLogValues = {
  photo: LogPhoto | null;
};

export type ImageFieldProjectForm = UseFormReturnType<ImageFieldProjectValues>;
export type ImageFieldLogForm = UseFormReturnType<ImageFieldLogValues>;
export type ImageFieldForm = ImageFieldProjectForm | ImageFieldLogForm;

export type ImageFieldFormBase<TValue = string | number | readonly string[] | undefined> = {
  getInputProps: (path: string) => {
    value?: TValue;
    onChange?: (...args: any[]) => void;
  };
};

export const parseIndex = (fieldName: string) => {
  const m = fieldName.match(/^photos\.(\d+)(?:\..+)?$/);
  if (!m) throw new Error(`Bad fieldName: ${fieldName}`);
  return Number(m[1]);
};

export const swapCoverWithGallery = ({
  form,
  fieldName,
}: {
  form: ImageFieldProjectForm;
  fieldName: string;
}) => {
  const i = parseIndex(fieldName);
  const cover = form.values.cover;
  const picked = form.values.photos?.[i];
  if (!picked) return;

  form.setFieldValue('cover', { ...picked, role: 'COVER' });

  if (!cover?.uri) {
    form.removeListItem('photos', i);
  } else {
    form.setFieldValue(`photos.${i}`, { ...cover, role: 'GALLERY' });
  }
};

export const moveCoverToPhotos = ({ form }: { form: ImageFieldProjectForm }) => {
  const cover = form.values.cover;
  const hasCover = !!(cover?.uri?.trim() || cover?.caption?.trim() || cover?.alt?.trim());
  if (!hasCover) return;

  form.insertListItem('photos', { ...cover, role: 'GALLERY' }, 0);
  form.setFieldValue('cover', { uri: '', caption: '', alt: '', role: 'COVER' });
};

export const deletePhotoFromProject = ({
  form,
  fieldName,
}: {
  form: ImageFieldProjectForm;
  fieldName: string;
}) => {
  const i = parseIndex(fieldName);
  form.removeListItem('photos', i);
};
