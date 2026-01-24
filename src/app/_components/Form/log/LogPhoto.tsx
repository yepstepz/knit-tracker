import { ImageField } from '@/app/_components/Form/common/ImageField';
import { useLayoutEffect } from 'react';

export const LogPhoto = (props) => {
  const form = props.context();
  const { fieldName } = props;
  return <ImageField form={form} fieldName={fieldName} />;
};
