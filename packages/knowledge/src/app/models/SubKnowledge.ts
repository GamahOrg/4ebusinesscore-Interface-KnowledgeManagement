class Party {
  id: string;
  nameAr: string;
  nameEn: string;

  constructor(id: string = "", nameAr: string = "", nameEn: string = "") {
    this.id = id;
    this.nameAr = nameAr;
    this.nameEn = nameEn;
  }
}

class Participant {
  userId: string;
  firstName: string;
  secondName: string;
  thirdName: string;
  fourthName: string;
  userImgUrl: string;

  constructor(
    userId: string = "",
    firstName: string = "",
    secondName: string = "",
    thirdName: string = "",
    fourthName: string = "",
    userImgUrl: string = ""
  ) {
    this.userId = userId;
    this.firstName = firstName;
    this.secondName = secondName;
    this.thirdName = thirdName;
    this.fourthName = fourthName;
    this.userImgUrl = userImgUrl;
  }
}
class AllSubKnowledges {
  result: SubKnowledge[];
  totalPages: number;
  totalItems: number;
  pageIndex: number;
  pageSize: number;

  constructor(
    result: SubKnowledge[] = [],
    totalPages = 0,
    totalItems = 0,
    pageIndex = 0,
    pageSize = 0
  ) {
    this.result = result;
    this.totalPages = totalPages;
    this.totalItems = totalItems;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
  }
}
class SubKnowledge {
  id: string;
  title: string;
  details: string;
  targets?: string;
  categoryId?: string;
  knowledgeId?: string;
  legislation?: string;
  date?: string;
  createdOn?: string;
  categoryNameAr?: string;
  categoryNameEn?: string;
  orgNameAr?: string;
  orgNameEn?: string;
  knowledgeRates?: number;
  knowledgeViews?: number;
  isFavoirate?: boolean;
  knowledgeLikes?: number;
  knowledgeDislikes?: number;
  knowledgeAttachments?: any[];
  participatingParties?: Party[];
  workParticipants?: Participant[];
  knowledgeName?: string;
 

  constructor(
    id: string = "",
    title: string = "",
    details: string = "",
    targets: string = "",
    categoryId: string = "",
    knowledgeId: string = "",
    legislation: string = "",
    date: string = "",
    createdOn: string = "",
    categoryNameAr: string = "",
    categoryNameEn: string = "",
    orgNameAr: string = "",
    orgNameEn: string = "",
    knowledgeRates: number = 0,
    knowledgeViews: number = 0,
    isFavoirate: boolean = false,
    knowledgeLikes: number = 0,
    knowledgeDislikes: number = 0,
    knowledgeAttachments: any[] = [],
    participatingParties: Party[] = [],
    workParticipants: Participant[] = [],
    knowledgeName: string = "",

  ) {
    this.id = id;
    this.title = title;
    this.details = details;
    this.targets = targets;
    this.legislation = legislation;
    this.categoryId = categoryId;
    this.knowledgeId = knowledgeId;
    this.date = date;
    this.createdOn = createdOn;
    this.categoryNameAr = categoryNameAr;
    this.categoryNameEn = categoryNameEn;
    this.orgNameAr = orgNameAr;
    this.orgNameEn = orgNameEn;
    this.knowledgeRates = knowledgeRates;
    this.knowledgeViews = knowledgeViews;
    this.isFavoirate = isFavoirate;
    this.knowledgeLikes = knowledgeLikes;
    this.knowledgeDislikes = knowledgeDislikes;
    this.knowledgeAttachments = knowledgeAttachments;
    this.participatingParties = participatingParties;
    this.workParticipants = workParticipants;
    this.knowledgeName = knowledgeName;

  }
}

export { SubKnowledge, AllSubKnowledges };
