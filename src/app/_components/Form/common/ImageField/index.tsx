import { Button, Badge, Stack, Text, TextInput, Group } from '@mantine/core';
import { IconStar, IconTrash } from '@tabler/icons-react';
import {
  moveCoverToPhotos,
  swapCoverWithGallery,
  deletePhotoFromProject,
} from '@/app/_components/Form/common/ImageField/utils';

export const ImageField = ({ fieldName, form }) => (
  <>
    {form.getInputProps(`${fieldName}.uri`).value ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={form.getInputProps(`${fieldName}.uri`).value as string}
        alt={
          form.getInputProps(`${fieldName}.alt`).value ||
          form.getInputProps(`${fieldName}.caption`).value ||
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
