export class UserBasicInfoModel {
    imageUrl: string;
    address: string;
    birthDate: string;
    nationality: string;
    userName: string;
    phoneNumber: string;
    email: string;
    forthName: string;
    thirdName: string;
    secondName: string;
    firstName: string;
    id: string;
  
    constructor(
        imageUrl: string="",
        address: string="",
        birthDate: string="",
        nationality: string="",
        userName: string="",
        phoneNumber: string="",
        email: string="",
        forthName: string="",
        thirdName: string="",
        secondName: string="",
        firstName: string="",
        id: string=""
    ) {
      this.id = id;
      this.firstName=firstName
      this.secondName=secondName
      this.thirdName=thirdName
      this.forthName=forthName
      this.email=email
      this.phoneNumber=phoneNumber
      this.imageUrl=imageUrl
      this.nationality=nationality
      this.userName=userName
      this.address=address
      this.birthDate=birthDate
    }
  }
  