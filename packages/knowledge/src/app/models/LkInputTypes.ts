export class LkInputTypesResponse {
  lkInputTypes?: LkInputType[];
  lkInputType?: LkInputType | null;

  constructor(lkInputTypes = [], lkInputType = null) {
    this.lkInputType = lkInputType;
    this.lkInputTypes = lkInputTypes;
  }
}

class LkInputType {
  id: string;
  nameAr: string;
  nameEn: string;
  constructor(id: string = "", nameAr: string = "", nameEn: string = "") {
    this.id = id;
    this.nameAr = nameAr;
    this.nameEn = nameEn;
  }
}

export default LkInputType;
