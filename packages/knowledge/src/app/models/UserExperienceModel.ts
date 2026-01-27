export class UserExperienceModel {
  experienceName: string;
  experienceYears: string;
  specialization: string;
  jobLocation: string;
  expertId: string;
  id?: string;

  constructor(
    experienceName: string = "",
    experienceYears: string = "",
    specialization: string = "",
    jobLocation: string = "",
    expertId: string = "",
    id: string = ""
  ) {
    this.id = id;
    this.experienceName = experienceName;
    this.experienceYears = experienceYears;
    this.specialization = specialization;
    this.jobLocation = jobLocation;
    this.expertId = expertId;
  }
}
