import { Button, Badge, Stack, Text, TextInput, Group } from '@mantine/core';
import { IconStar, IconTrash } from '@tabler/icons-react';
import {
  moveCoverToPhotos,
  swapCoverWithGallery,
  deletePhotoFromProject,
} from '@/app/_components/Form/common/ImageField/utils';

export const Index = ({ fieldName, context, isCover, isGallery, index }) => {
  const form = context();
  return (
    <Stack gap='md'>
      <Group justify='space-between'>
        {isCover ? (
          <>
            <CoverBadge />
            <RemoveCoverButton onClick={() => moveCoverToPhotos({ form })} />
          </>
        ) : null}
        {isGallery ? (
          <>
            <SetAsCoverButton onClick={() => swapCoverWithGallery({ form, fieldName })} />
            <DeleteButton onClick={() => deletePhotoFromProject({ form, fieldName })} />
          </>
        ) : null}
      </Group>

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
    </Stack>
  );
};

export function CoverBadge() {
  return (
    <Badge
      variant='outline'
      leftSection={<IconStar size={12} />}
      radius='sm'
      size='xl'
      style={{ textTransform: 'none' }}
    >
      Cover
    </Badge>
  );
}

export function SetAsCoverButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button variant='light' radius='md' size='sm' leftSection={<IconStar size={16} />} {...props}>
      Set as cover
    </Button>
  );
}

export function RemoveCoverButton(props) {
  return (
    <Button
      color='red'
      variant='light'
      radius='md'
      size='sm'
      leftSection={<IconTrash size={16} />}
      {...props}
    >
      Remove cover
    </Button>
  );
}

export const DeleteButton = (props) => (
  <Button
    color='red'
    variant='light'
    radius='md'
    size='sm'
    leftSection={<IconTrash size={16} />}
    {...props}
  >
    Delete
  </Button>
);
