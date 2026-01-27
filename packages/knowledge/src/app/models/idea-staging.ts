import { RequestStage } from "../enums/enums";

class Ideastaging {
    ideaId: string;
    requestStage: RequestStage;
    notes: string;
   
  
    constructor(
        ideaId: string = '',
        requestStage: RequestStage = RequestStage.Pending,
        notes: string = '',
    ) {
      this.ideaId = ideaId;
      this.requestStage = requestStage;
      this.notes = notes;
    }
  }