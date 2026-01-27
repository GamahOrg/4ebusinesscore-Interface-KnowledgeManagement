import { object, string, InferType, number, boolean, mixed } from "yup";
let emailExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
let phoneExp = /^(5|0|3|6|4|9|1|8|7)([0-9]{8})$/;
export const EditExpertBasicInfoSchema = object({
  imgUrl: mixed().notRequired(),
  firstName: string().required("InputFieldIsRequried"),
  secondName: string().required("InputFieldIsRequried"),
  thirdName: string().notRequired(),
  forthName: string().notRequired(),
  isOutsideFromSystem: boolean(),
  email:string().notRequired()
  .test("InvalidEmail", "InvalidEmail", (value) => {
    if (!value) {
      return true;
    } else {
      return emailExp.test(value);
    }
  }),
  phoneNumber: string().notRequired(),
  nationality: string().nullable().notRequired(),
  address: string().nullable().notRequired(),
  informationAboutExpert: string().nullable().notRequired(),
  birthDate: string().nullable().notRequired(),
});

export type EditExpertBasicInfoProps = InferType<
  typeof EditExpertBasicInfoSchema
>;
