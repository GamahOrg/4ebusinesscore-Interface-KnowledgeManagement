import { RequestStage } from "../enums/enums";

export class QuestionsArrayModel {
  questions?: QuestionsModel[];
  question?: QuestionsModel | null;
  totalPages: number;
  totalItems: number;
  pageIndex: number;
  pageSize: number;

  constructor(
    questions = [],
    question = null,
    totalPages = 0,
    totalItems = 0,
    pageSize = 0,
    pageIndex = 0
  ) {
    this.question = question;
    this.questions = questions;
    this.totalPages = totalPages;
    this.totalItems = totalItems;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
  }
}
export class QuestionsModel {
  id: number;
  body: string;
  firstName: string;
  secondName: string;
  thirdName: string;
  fourthName: string;
  orgNameAr: string;
  orgNameEn: string;
  specializationNameAr: string;
  specializationNameEn: string;
  userImgUrl: string;
  createdBy: string;
  createdOn: string;
  commentCount: number;
  requestStage?: RequestStage;
  questionStatus: number;
  email?:string;
  experts?:any;
  type?: number;
  notes?:string;
  constructor(
    id: number = 0,
    body: string = "",
    firstName: string = "",
    secondName: string = "",
    thirdName: string = "",
    fourthName: string = "",
    orgNameAr: string = "",
    orgNameEn: string = "",
    specializationNameAr: string = "",
    specializationNameEn: string = "",
    userImgUrl: string = "",
    createdBy: string = "",
    createdOn: string = "",
    commentCount: number = 0,
    requestStage: RequestStage = RequestStage.Pending,
    questionStatus: number = 0,
    email:string="",
    experts:any= [],
    type: number = 0,
    notes:string="",
  ) {
    this.id = id;
    this.body = body;
    this.firstName = firstName;
    this.secondName = secondName;
    this.thirdName = thirdName;
    this.fourthName = fourthName;
    this.orgNameAr = orgNameAr;
    this.orgNameEn = orgNameEn;
    this.specializationNameAr = specializationNameAr;
    this.specializationNameEn = specializationNameEn;
    this.userImgUrl = userImgUrl;
    this.createdBy = createdBy;
    this.createdOn = createdOn;
    this.commentCount = commentCount;
    this.requestStage = requestStage;
    this.questionStatus = questionStatus;
    this.email=email;
    this.experts = experts;
    this.type = type;
    this.notes = notes;
  }
}
