class Categories {
  map(arg0: (knowledgeCategory: Category[]) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode {
    throw new Error("Method not implemented.");
  }
  Categories: Category[];
  totalPages: number;
  totalItems: number;
  pageIndex: number;
  pageSize: number;

  constructor(
    Categories: Category[] = [],
    totalPages: number = 0,
    totalItems: number = 0,
    pageIndex: number = 0,
    pageSize: number = 0
  ) {
    this.Categories = Categories;
    this.totalPages = totalPages;
    this.totalItems = totalItems;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
  }
}
class Category {
  id: string;
  nameAr: string;
  nameEn: string;
  description: string;
  cssClasses: string;

  constructor(
    id: string = "",
    nameAr: string = "",
    nameEn: string = "",
    description: string = "",
    cssClasses: string = "" 

 
  ) {
    this.id = id;
    this.nameAr = nameAr;
    this.nameEn = nameEn;
    this.description = description;
    this.cssClasses = cssClasses;
  }
}
export { Categories, Category };
