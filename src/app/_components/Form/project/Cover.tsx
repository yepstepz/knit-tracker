import { ProjectImage } from '@/app/_components/Form/project/ProjectImage';

export const CoverImage = ({ context }) => {
  return <ProjectImage fieldName='cover' context={context} isCover />;
};
