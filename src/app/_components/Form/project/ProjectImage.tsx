import { ImageField } from '@/app/_components/Form/common/ImageField';
import { Badge, Button, Group, Stack } from '@mantine/core';
import {
  deletePhotoFromProject,
  moveCoverToPhotos,
  swapCoverWithGallery,
} from '@/app/_components/Form/common/ImageField/utils';
import { IconStar, IconTrash } from '@tabler/icons-react';

export const ProjectImage = (props) => {
  const form = props.context();
  const { fieldName } = props;
  return (
    <Stack gap='md'>
      <Group justify='space-between'>
        {props.isCover ? (
          <>
            <CoverBadge />
            <RemoveCoverButton onClick={() => moveCoverToPhotos({ form })} />
          </>
        ) : null}
        {props.isGallery ? (
          <>
            <SetAsCoverButton onClick={() => swapCoverWithGallery({ form, fieldName })} />
            <DeleteButton onClick={() => deletePhotoFromProject({ form, fieldName })} />
          </>
        ) : null}
      </Group>
      <ImageField form={form} fieldName={fieldName} />
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
