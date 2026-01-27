import React from "react";
import { useIntl } from "react-intl";
import { Actions } from "./Actions";
import { RootState } from "../../../../store/store";
import { useSelector } from "react-redux";
import { ExperienceModel } from "../../../../models/experienceModel";

interface Iprop {
  experience: ExperienceModel;
  index?: number;
  fromApi?: boolean;
  setExperienceData?: any;
  experienceData?: any;
  expertId?: string;
}

const TableRow: React.FC<Iprop> = ({
  experience,
  index,
  fromApi,
  setExperienceData,
  experienceData,
  expertId,
}) => {
  const intl = useIntl();
  let language = intl.locale;
  let specializations = useSelector((state: RootState) => {
    return state?.specializations?.data;
  });

  return (
    <>
      <tr style={{ verticalAlign: "middle" }}>
        <td style={{ verticalAlign: "middle" }}>
          <p 
          style={{ color: "#A1A5B7"}}
          className="text-center">{(index as number) + 1}</p>
        </td>
        <td style={{ verticalAlign: "middle" }}>
          <p 
          style={{ color: "#A1A5B7"}}
          className="text-center">{experience?.experienceName}</p>
        </td>
        <td style={{ verticalAlign: "middle" }}>
          <p 
          style={{ color: "#A1A5B7"}}
          className="text-center">{experience?.experienceYears}</p>
        </td>
        <td style={{ verticalAlign: "middle" }}>
          <p 
          style={{ color: "#A1A5B7"}}
          className="text-center">
            {language == "ar"
              ? specializations?.find((ele) => {
                  return experience?.specializationId == ele?.id;
                })?.nameAr
              : specializations?.find((ele) => {
                  return experience?.specializationId == ele?.id;
                })?.nameEn}
          </p>
        </td>
        <td style={{ verticalAlign: "middle" }}>
          <p 
          style={{ color: "#A1A5B7"}}
          className="text-center">{experience?.jobLocation}</p>
        </td>
        <td className="text-center">
          <Actions experience={experience} id={experience?.id} expertId={expertId} />
        </td>
      </tr>
    </>
  );
};

export { TableRow };
