import { Paper } from '@mantine/core';
import { ProjectImage } from '@/app/_components/Form/project/ProjectImage';
import type { ImageValue } from '@/app/_components/Form/common/ImageField/utils';
import type { useFormContext } from '@/app/_components/Form/project/actions/form-context';

type GalleryProps = {
  photos: Array<ImageValue & { id?: string }>;
  context: typeof useFormContext;
};

export const Gallery = ({ photos, context }: GalleryProps) => {
  return (
    <>
      {photos.map((photo, i) => (
        <Paper withBorder radius='lg' p='lg' key={photo.id || i}>
          <ProjectImage
            fieldName={`photos.${i}`}
            context={context}
            isGallery
          />
        </Paper>
      ))}
    </>
  );
};
