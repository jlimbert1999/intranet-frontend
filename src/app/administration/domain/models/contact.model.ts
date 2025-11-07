export interface InstanceType {
 id: string; 
 name: string;
}

export interface Contacto {

 id: string;
 instanceType: InstanceType; 
 instanceTypeId?: string; 

 instancia: string;
 jefe: number | null;
 soporte: number | null;
 secretaria: number | null;
 telefonoFijo: number | null;
 direccion?: string;
 createdAt: string;
 updatedAt: string;
}