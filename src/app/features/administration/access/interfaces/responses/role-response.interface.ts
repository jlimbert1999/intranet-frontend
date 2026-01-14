export interface RoleResponse {
  id: string;
  name: string;
  description: null;
  permissions: PermissionResponse[];
}

export interface PermissionResponse {
  id: string;
  resource: string;
  actions: any[];
}

