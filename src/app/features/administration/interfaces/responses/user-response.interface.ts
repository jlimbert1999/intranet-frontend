export interface UserResponse {
  id: string;
  fullName: string;
  roles: UserRolesResponse[];
}

export interface UserRolesResponse {
  id: string;
  name: string;
  description: string;
}
