import { Button, Badge, Stack, Text, TextInput, Group } from '@mantine/core';
import { IconStar, IconTrash } from '@tabler/icons-react';
import {
  moveCoverToPhotos,
  swapCoverWithGallery,
  deletePhotoFromProject,
  type ImageFieldFormBase,
} from '@/app/_components/Form/common/ImageField/utils';

type ImageFieldProps = {
  fieldName: string;
  form: ImageFieldFormBase<string | number | readonly string[] | undefined>;
};

export const ImageField = ({ fieldName, form }: ImageFieldProps) => (
  <>
    {form.getInputProps(`${fieldName}.uri`).value ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={form.getInputProps(`${fieldName}.uri`).value as string}
        alt={
          (form.getInputProps(`${fieldName}.alt`).value as string | undefined) ||
          (form.getInputProps(`${fieldName}.caption`).value as string | undefined) ||
          'Cover'
        }
        style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 12 }}
      />
    ) : (
      <Text size='sm' c='dimmed'>
        No cover
      </Text>
    )}
    <TextInput label='URI' {...form.getInputProps(`${fieldName}.uri`)} />
    <TextInput label='Caption' {...form.getInputProps(`${fieldName}.caption`)} />
    <TextInput label='Alt (optional)' {...form.getInputProps(`${fieldName}.alt`)} />
  </>
);
