import { LikeStatus } from "../enums/enums";

export class CommentResponse {
  comments?: Comment[];
  comment?: Comment | null;
  totalPages: number;
  totalItems: number;
  pageIndex: number;
  pageSize: number;

  constructor(
    comments = [],
    comment = null,
    totalPages = 0,
    totalItems = 0,
    pageSize = 0,
    pageIndex = 0
  ) {
    this.comments = comments;
    this.comment = comment;
    this.totalPages = totalPages;
    this.totalItems = totalItems;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
  }
}

export class Comment {
  id: string;
  commentText?: string;
  description?: string;
  createdOn: string;
  firstName: string;
  secondName: string;
  thirdName: string;
  fourthName: string;
  ideaBankId?: string;
  blogId?: string;
  challengeId?: string;
  createdBy: string;
  userImgUrl: string;
  parentCommentId?: string;
  parentComment?: Comment;
  replies?: Comment[];
  commentLikes?: LikeStatus[];
  commentLikesCount?: LikeStatus[];
  commentAttachment?: string;

  constructor(
    id: string = "",
    commentText: string = "",
    description: string = "",
    createdOn: string = "",
    firstName: string = "",
    secondName: string = "",
    thirdName: string = "",
    fourthName: string = "",
    ideaBankId: string = "",
    blogId: string = "",
    challengeId: string = "",
    createdBy: string = "",
    userImgUrl: string = "",
    parentCommentId?: string,
    parentComment?: Comment,
    replies: Comment[] = [],
    commentLikes: LikeStatus[] = [],
    commentLikesCount: LikeStatus[] = [],
    commentAttachment: string = ""
  ) {
    this.id = id;
    this.commentText = commentText;
    this.description = description;
    this.createdOn = createdOn;
    this.firstName = firstName;
    this.secondName = secondName;
    this.thirdName = thirdName;
    this.fourthName = fourthName;
    this.ideaBankId = ideaBankId;
    this.blogId = blogId;
    this.challengeId = challengeId;
    this.createdBy = createdBy;
    this.userImgUrl = userImgUrl;
    this.parentCommentId = parentCommentId;
    this.parentComment = parentComment;
    this.replies = replies;
    this.commentLikes = commentLikes;
    this.commentLikesCount = commentLikesCount;
    this.commentAttachment = commentAttachment;
  }
}
