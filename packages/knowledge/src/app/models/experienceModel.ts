export class ExperienceModel {
  id: string;
  experienceName: string;
  jobLocation: string;
  specializationNameEn: string;
  specializationNameAr: string;
  specializationId: string;
  experienceYears: string;

  constructor(
    id: string = "",
    experienceName: string = "",
    jobLocation: string = "",
    specializationNameEn: string = "",
    specializationNameAr: string = "",
    specializationId: string = "",
    experienceYears: string = ""
  ) {
    this.id = id;
    this.experienceName = experienceName;
    this.experienceYears = experienceYears;
    this.jobLocation = jobLocation;
    this.specializationId = specializationId;
    this.specializationNameAr = specializationNameAr;
    this.specializationNameEn = specializationNameEn;
  }
}
