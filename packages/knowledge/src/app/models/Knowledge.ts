import { KnowledgeType } from "../enums/enums";
class AllKnowledge {
  knowledge?: Knowledge | null;
  knowledges?: Knowledge[];
  totalPages: number;
  totalItems: number;
  pageIndex: number;
  pageSize: number;

  constructor(
    knowledge: null,
    knowledges: Knowledge[] = [],
    totalPages: number = 0,
    totalItems: number = 0,
    pageIndex: number = 0,
    pageSize: number = 0
  ) {
    this.knowledge = knowledge;
    this.knowledges = knowledges;
    this.totalPages = totalPages;
    this.totalItems = totalItems;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
  }
}

class Knowledge {
  id: string;
  name: string;
  knowledgeType: KnowledgeType;
  icon: string;
  color: string;
  categoryId: string;
  orgHierarchyId?: string[];
  userIds?: string[];
  constructor(
    id: string = "",
    name: string = "",
    knowledgeType: KnowledgeType = 0,
    icon: string = "",
    color: string = "",
    categoryId: string = "",
    orgHierarchyId: string[] = [],
    userIds: string[] = []
  ) {
    this.id = id;
    this.name = name;
    this.knowledgeType = knowledgeType;
    this.icon = icon;
    this.color = color;
    this.categoryId = categoryId;
    this.orgHierarchyId = orgHierarchyId;
    this.userIds = userIds;
  }
}

export { AllKnowledge, Knowledge };
