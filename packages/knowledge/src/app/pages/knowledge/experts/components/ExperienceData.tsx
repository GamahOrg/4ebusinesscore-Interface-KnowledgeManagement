import { Fragment, useState } from "react";
import { TableRow } from "./TableRow";
import { useIntl } from "react-intl";
import { SystemPagination } from "../../../../../app/pages/partials/SystemPagination";

const ExperienceData = ({experienceData,setExperienceData}:any) => {
  const intl = useIntl();
  let [fromApi,setFromApi]=useState<boolean>(false)
  return (
    <Fragment>
      <p
        style={{ fontWeight: "700", fontSize: "18px"
      }}
        className="mb-4"
      >
        {intl.formatMessage({ id: "ExperiencesData" })}{" "}
      </p>
      <hr />
      <div className="table-responsive mt-4">
        <table
          className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-7"
          id="REGA-WS-caseList"
        >
          <thead>
            <tr className="fw-bolder text-muted">
              <th className="min-w-50px text-center">
                {intl.formatMessage({ id: "Sequence" })}
              </th>
              <th className="min-w-150px text-center">
                {intl.formatMessage({ id: "ExperienceName" })}
              </th>
              <th className="min-w-150px text-center">
                {intl.formatMessage({ id: "YearsOfExperience" })}
              </th>
              <th className="min-w-150px text-center">
                {intl.formatMessage({ id: "Specialization" })}
              </th>
              <th className="min-w-100px text-center">
                {intl.formatMessage({ id: "PlaceOfPractice" })}
              </th>
              <th className="min-w-100px text-center">
                {intl.formatMessage({ id: "Procedures" })}
              </th>
            </tr>
          </thead>
          <tbody>
            {experienceData?.map((experience: any,index:number) => {
              return (
                <Fragment key={index}>
                  {" "}
                  <TableRow experienceData={experienceData} setExperienceData={setExperienceData} experience={experience} index={index} fromApi={fromApi}/>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <SystemPagination />
    </Fragment>
  );
};

export { ExperienceData };
