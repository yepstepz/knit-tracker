import { ProjectImage } from '@/app/_components/Form/project/ProjectImage';
import type { useFormContext } from '@/app/_components/Form/project/actions/form-context';

type CoverImageProps = {
  context: typeof useFormContext;
};

export const CoverImage = ({ context }: CoverImageProps) => {
  return <ProjectImage fieldName='cover' context={context} isCover />;
};
