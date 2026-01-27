
export class ExpertsBySpecializationIdArrayModel {
    data: ExpertsBySpecializationIdModel[];
    totalPages: number;
    totalItems: number;
  
    constructor(data: ExpertsBySpecializationIdModel[]=[], totalPages: number=1, totalItems: number=1) {
      this.data = data;
      this.totalPages = totalPages;
      this.totalItems = totalItems;
    }
}

export class ExpertsBySpecializationIdModel {
    specializationNameAr: string;
    specializationNameEn: string;
    experts: ExpertModel[];
   
    constructor(
        specializationNameAr: string = '',
        specializationNameEn: string = '',
        experts: ExpertModel[] = [],
      ) {
        this.specializationNameAr = specializationNameAr;
        this.specializationNameEn = specializationNameEn;
        this.experts = experts;
        }
  }
export class ExpertModel {
    id: number;
    firstName: string;
    secondName: string;
    thirdName: string;
    fourthName:string;
    imgUrl: string;
    email: string;
    experiences: ExperienceModel[];
    phoneNumber:number;
    birthDate: string;
    nationality:string;
    specializationId:string;
    address:string;
    informationAboutExpert: string;
    specialization: string;
    orgName: string;
    isExternalExpert?: boolean;
    isChecked?:boolean;

    constructor(
        id: number = 0,
        firstName: string = '',
        secondName: string = '',
        thirdName: string = '',
        fourthName: string = '',
        imgUrl: string = '',
        email: string = '',
        experiences: ExperienceModel[] = [],
        phoneNumber: number = 0,
        birthDate: string = '',
        nationality: string = '',
        specializationId: string = '',
        address: string = '',
        informationAboutExpert: string = '',
        specialization: string = '',
        orgName: string = '',
        isExternalExpert: false,
        isChecked:false,
      ) {
        this.id = id;
        this.firstName = firstName;
        this.secondName = secondName;
        this.thirdName = thirdName;
        this.fourthName = fourthName;
        this.imgUrl = imgUrl;
        this.email = email;
        this.experiences = experiences;
        this.phoneNumber = phoneNumber;
        this.birthDate = birthDate;
        this.nationality = nationality;
        this.specializationId = specializationId;
        this.address = address;
        this.informationAboutExpert = informationAboutExpert;
        this.specialization = specialization;
        this.orgName = orgName;
        this.isExternalExpert = isExternalExpert;
        this.isChecked=isChecked;
        }
  }


  export class ExperienceModel {
    id: string;
    experiencesExperienceName: string;
    constructor(
        id: string = '',
        experiencesExperienceName: string = '',
      ) {
        this.id = id;
        this.experiencesExperienceName = experiencesExperienceName;
        }
  }
  

 
  