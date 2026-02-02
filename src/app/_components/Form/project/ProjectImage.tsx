import { ImageField } from '@/app/_components/Form/common/ImageField';
import { Badge, Button, Group, Stack } from '@mantine/core';
import {
  deletePhotoFromProject,
  moveCoverToPhotos,
  swapCoverWithGallery,
  type ImageFieldProjectForm,
} from '@/app/_components/Form/common/ImageField/utils';
import { IconStar, IconTrash } from '@tabler/icons-react';
import type { FC, MouseEventHandler } from 'react';
import type { useFormContext } from '@/app/_components/Form/project/actions/form-context';

type ProjectImageProps = {
  fieldName: 'cover' | `photos.${number}`;
  context: typeof useFormContext;
  isCover?: boolean;
  isGallery?: boolean;
};

export const ProjectImage = (props: ProjectImageProps) => {
  const form = props.context() as unknown as ImageFieldProjectForm;
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

type ActionButtonProps = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export const SetAsCoverButton: FC<ActionButtonProps> = (props) => {
  return (
    <Button variant='light' radius='md' size='sm' leftSection={<IconStar size={16} />} {...props}>
      Set as cover
    </Button>
  );
};

export const RemoveCoverButton: FC<ActionButtonProps> = (props) => {
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
};

export const DeleteButton: FC<ActionButtonProps> = (props) => (
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
