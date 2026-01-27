import { State } from "@4eplatform/shared/enums/enums";

export interface MyComponentsModel {
  id: string;
  noteNameAr: string;
  noteNameEn: string;
  url: string;
  description: string;
  icon: string;
  color: number;
  state: State;
  isActive: boolean;
  visitDate: string;
  lastUpdate: string;
  organizationHierarchyId: string | null;
  noteTypeId: string | null;
  parentId: string | null;
  orgNameAr: string;
  orgNameEn: string;
  isChecked: boolean;
  parentNoteNameAr: string;
  parentNoteNameEn: string;
  workspaceKey: string;
}
