import {object, string, InferType, number} from 'yup'

export const AddQuestionSchema = object({
    expertIds: number().moreThan(-1),
    specializationId: string(),
    body: string().required('QuestionIsRequired'),
    })

export type AddQuestionProps = InferType<typeof AddQuestionSchema>



export const EditQuestionSchema = object({
    // expertIds: number().moreThan(-1),
    // specializationId: string(),
    body: string().required('QuestionIsRequired'),
    })

export type EditQuestionProps = InferType<typeof EditQuestionSchema>