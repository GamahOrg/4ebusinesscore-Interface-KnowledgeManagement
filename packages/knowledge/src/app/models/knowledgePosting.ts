import { RequestStage } from "../enums/enums";

class KnowledgePostingResponse {
    knowledgePostings?: KnowledgePosting[];
    totalPages: number;
    totalItems: number;
    pageIndex: number;
    pageSize: number;
    result: any;
  
    constructor(
      knowledgePostings: KnowledgePosting[] = [],
      totalPages = 0,
      totalItems = 0,
      pageIndex = 0,
      pageSize = 0
    ) {
      this.knowledgePostings = knowledgePostings;
      this.totalPages = totalPages;
      this.totalItems = totalItems;
      this.pageIndex = pageIndex;
      this.pageSize = pageSize;
    }
  } 
  
  class KnowledgePosting {
    id: string;
  title: string;
  description: string;
  firstName: string;
  secondName: string;
  thirdName: string | null;
  fourthName: string;
  userImgUrl: string;
  createdBy: string;
  createdOn: string;
  notes: string | null;
  requestStage: RequestStage;
  attachments?:[];


  
    constructor(
      id: string = '',
      title: string = '',
      description: string ='',
      firstName: string ='',
      secondName: string ='',
      thirdName: string ='',
      fourthName: string ='',
      userImgUrl: string ='',
      createdBy: string = '',
      createdOn: string = '',
      notes: string ='',
      requestStage: RequestStage = RequestStage.Pending,
      attachments:[]=[],
    ) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.firstName = firstName;
      this.secondName = secondName;
      this.thirdName = thirdName;
      this.fourthName = fourthName;
      this.userImgUrl = userImgUrl;
      this.createdBy = createdBy;
      this.createdOn = createdOn;
      this.notes = notes;
      this.requestStage = requestStage;
      this.attachments=attachments;
    }
  }
  
  export { KnowledgePostingResponse, KnowledgePosting };