export interface InstanceTypePortal {
  id: string;
  name: string;
}

export interface DirectoryContact {
  id: string;
  instancia: string;
  direccion: string | null;
  jefe: number | null; 
  soporte: number | null; 
  secretaria: number | null; 
  telefonoFijo: number | null; 
  instanceType: InstanceTypePortal | null; 
}

export interface ContactDirectoryResponse {
  data: DirectoryContact[];
  total: number;
  page: number;
  limit: number;
}
