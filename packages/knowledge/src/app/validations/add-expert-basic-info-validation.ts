import { object, string, InferType, number, boolean, mixed } from "yup";
let emailExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
let phoneExp=/^(5|0|3|6|4|9|1|8|7)([0-9]{8})$/
export const AddExpertBasicInfoSchema = object({
  imgUrl: mixed().notRequired(),
  // .test(
  //   "is-image",
  //   "FileMustBeImage",
  //   (value) => value && value.type.startsWith("image/")
  // ),
  firstName: string().required("InputFieldIsRequried").typeError("InputFieldIsRequried"),
  secondName: string().required("InputFieldIsRequried").typeError("InputFieldIsRequried"),
  thirdName: string().notRequired().typeError("InputFieldIsRequried"),
  forthName: string().notRequired().typeError("InputFieldIsRequried"),
  isOutsideFromSystem:boolean(),
  // email: string().when("isOutsideFromSystem", {
  //   is: true,
  //   then: string().required("InputFieldIsRequried").matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,"InvalidEmail"),
  //   otherwise:string()
  //   .notRequired()
  //   .test("InvalidEmail", "InvalidEmail", (value) => {
  //     if (!value) {
  //       return true;
  //     } else {
  //       return emailExp.test(value);
  //     }
  //   })
  // }),
  email:string().notRequired()
  .test("InvalidEmail", "InvalidEmail", (value) => {
    if (!value) {
      return true;
    } else {
      return emailExp.test(value);
    }
  }),
  phoneNumber: string()
    .notRequired(),
    
  nationality: string().nullable().notRequired(),
  address: string().nullable().notRequired(),
  informationAboutExpert: string().nullable().notRequired(),
  birthDate: string().nullable().notRequired(),
});

export type AddExpertBasicInfoProps = InferType<
  typeof AddExpertBasicInfoSchema
>;
