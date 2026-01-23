import { Paper } from '@mantine/core';
import { Index } from '@/app/_components/Form/common/ImageField';

export const Gallery = ({ photos, context }) => {
  return (
    <>
      {photos.map((photo, i) => (
        <Paper withBorder radius='lg' p='lg' key={photo.id || i}>
          <Index
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
