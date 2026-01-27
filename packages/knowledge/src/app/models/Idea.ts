import { IdeaCategory, LikeStatus, RequestStage } from "../enums/enums";

export class IdeaResponse {
  ideas?: Idea[];
  idea?: Idea | null;
  totalPages: number;
  totalItems: number;
  pageIndex: number;
  pageSize: number;

  constructor(
    ideas = [],
    idea = null,
    totalPages = 0,
    totalItems = 0,
    pageSize = 0,
    pageIndex = 0
  ) {
    this.idea = idea;
    this.ideas = ideas;
    this.totalPages = totalPages;
    this.totalItems = totalItems;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
  }
}

class Idea {
  id: string;
  ideaCategory: IdeaCategory;
  title: string;
  description: string;
  createdOn: string;
  requestStage?: RequestStage;
  notes?: string | null;
  ideaAttachments?: string[];
  ideaRate?: number;
  rates?: number;
  ideaViews: number;
  likesCount: number;
  dislikesCount: number;
  commentsCount?: number;
  commentCount?: number;
  isLikedByLoggedInUser: boolean;
  isDisLikedByLoggedInUser: boolean;
  constructor(
    id: string = "",
    ideaCategory: IdeaCategory = IdeaCategory.New,
    title: string = "",
    description: string = "",
    createdOn: string = "",
    requestStage: RequestStage = RequestStage.Pending,
    notes: string | null = null,
    ideaAttachments: string[] = [],
    ideaRate: number = 0,
    rates: number = 0,
    ideaViews: number = 0,
    likesCount: number = 0,
    dislikesCount: number = 0,
    commentsCount: number = 0,
    commentCount: number = 0,
    isLikedByLoggedInUser: boolean = false,
    isDisLikedByLoggedInUser: boolean = false
  ) {
    this.id = id;
    this.ideaCategory = ideaCategory;
    this.title = title;
    this.description = description;
    this.createdOn = createdOn;
    this.requestStage = requestStage;
    this.notes = notes;
    this.ideaAttachments = ideaAttachments;
    this.ideaRate = ideaRate;
    this.rates = rates;
    this.ideaViews = ideaViews;
    this.likesCount = likesCount;
    this.dislikesCount = dislikesCount;
    this.commentsCount = commentsCount;
    this.commentCount = commentCount;
    this.isLikedByLoggedInUser = isLikedByLoggedInUser;
    this.isDisLikedByLoggedInUser = isDisLikedByLoggedInUser;
  }
}

export default Idea;
