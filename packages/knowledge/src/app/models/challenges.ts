import { RequestStage } from "../enums/enums";

export class ChallengeArrayModel {
  Challenges?: ChallengeModel[];
  Challenge?: ChallengeModel;
  totalPages: number;
  totalItems: number;
  pageIndex: number;
  pageSize: number;

  constructor(
    Challenges = [],
    Challenge = new ChallengeModel(),
    totalPages = 0,
    totalItems = 0,
    pageSize = 0,
    pageIndex = 0
  ) {
    this.Challenges = Challenges;
    this.Challenge = Challenge;
    this.totalPages = totalPages;
    this.totalItems = totalItems;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
  }
}
export class ChallengeModel {
  id: number;
  projectName: string;
  title: string;
  description: string;
  firstName: string;
  secondName: string;
  thirdName: string;
  fourthName: string;
  userImgUrl: string;
  createdBy: string;
  createdOn: string;
  commentCount: number;
  requestStage?: RequestStage;
  challengeAttachments?: string[];
  requestNote?: string;
  notes?: string;

  constructor(
    id: number = 0,
    projectName: string = "",
    title: string = "",
    description: string = "",
    firstName: string = "",
    secondName: string = "",
    thirdName: string = "",
    fourthName: string = "",
    userImgUrl: string = "",
    createdBy: string = "",
    createdOn: string = "",
    commentCount: number = 0,
    requestStage: RequestStage = RequestStage.Pending,
    challengeAttachments: string[] = [],
    requestNote: string = "",
    notes: string = ""
  ) {
    this.id = id;
    this.projectName = projectName;
    this.title = title;
    this.description = description;
    this.firstName = firstName;
    this.secondName = secondName;
    this.thirdName = thirdName;
    this.fourthName = fourthName;
    this.userImgUrl = userImgUrl;
    this.createdBy = createdBy;
    this.createdOn = createdOn;
    this.commentCount = commentCount;
    this.requestStage = requestStage;
    this.challengeAttachments = challengeAttachments;
    this.requestNote = requestNote;
    this.notes = notes;
  }
}
