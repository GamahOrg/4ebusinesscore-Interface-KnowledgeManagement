import {string , object} from 'yup';

export const addCommentValidations = object().shape({
    commentText: string().required('ThisFelidIsRequired'),
  });