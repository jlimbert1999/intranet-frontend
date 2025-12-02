export interface PermisssionResponse {
  id: string;
  resource: string;
  actions: ActionResponse[];
}

export interface ActionResponse {
  id: string;
  action: string;
}
