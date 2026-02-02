import { ImageField } from '@/app/_components/Form/common/ImageField';
import type { ImageFieldFormBase } from '@/app/_components/Form/common/ImageField/utils';
import type { useFormContext } from '@/app/_components/Form/log/actions/form-context';

type LogPhotoProps = {
  context: () => ImageFieldFormBase<string | number | readonly string[] | undefined>;
  fieldName: 'photo';
};

export const LogPhoto = (props: LogPhotoProps) => {
  const form = props.context();
  const { fieldName } = props;
  return <ImageField form={form} fieldName={fieldName} />;
};
