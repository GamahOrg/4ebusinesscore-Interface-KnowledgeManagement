export class BlogResponse {
  blogs?: Blog[];
  blog?: Blog | null;
  totalPages: number;
  totalItems: number;
  pageIndex: number;
  pageSize: number;

  constructor(
    blogs = [],
    blog = null,
    totalPages = 0,
    totalItems = 0,
    pageSize = 0,
    pageIndex = 0
  ) {
    this.blogs = blogs;
    this.blog = blog;
    this.totalPages = totalPages;
    this.totalItems = totalItems;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
  }
}

class Blog {
  id: string;
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
  likeCount: number;
  disLikeCount: number;
  requestStage: number;
  blogAttachments: string[];
  isLiked: boolean;
  isDisliked: boolean;
  notes?:string;
  constructor(
    id: string = "",
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
    likeCount: number = 0,
    disLikeCount: number = 0,
    requestStage: number = 0,
    blogAttachments: string[] = [],
    isLiked: boolean = false,
    isDisliked: boolean = false,
    notes: string = "",
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
    this.commentCount = commentCount;
    this.likeCount = likeCount;
    this.disLikeCount = disLikeCount;
    this.requestStage = requestStage;
    this.blogAttachments = blogAttachments;
    this.isLiked = isLiked;
    this.isDisliked = isDisliked;
    this.notes = notes;
  }
}
export default Blog;
