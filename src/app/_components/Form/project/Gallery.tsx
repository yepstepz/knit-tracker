import { Paper } from '@mantine/core';
import { ProjectImage } from '@/app/_components/Form/project/ProjectImage';

export const Gallery = ({ photos, context }) => {
  return (
    <>
      {photos.map((photo, i) => (
        <Paper withBorder radius='lg' p='lg' key={photo.id || i}>
          <ProjectImage
            fieldName={`photos.${i}`}
            title='Фото из галереи'
            index={i}
            context={context}
            isGallery
          />
        </Paper>
      ))}
    </>
  );
};
