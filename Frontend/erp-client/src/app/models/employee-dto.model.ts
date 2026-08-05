/**
 * EmployeeDTO — Interface map với EmployeeDTO từ Backend
 * Dữ liệu đã được JOIN (DepartmentName, PositionName)
 */
export interface EmployeeDTO {
  employeeId: string;
  fullName: string;
  email: string;
  departmentName: string;
  positionName: string;
  status: string;
}

export interface EmployeeInput {
  employeeId: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  departmentId: string;
  positionId: string;
  hireDate: string;
  status: string;
}

export interface Employee {
  employeeId: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  departmentId: string;
  positionId: string;
  hireDate: string;
  status: string;
}

export interface Department {
  departmentId: string;
  departmentName: string;
  location?: string;
}

export interface Asset {
  assetId: string;
  assetName: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  departmentId: string;
  departmentName: string;
  status: string;
  purchaseDate: string;
  description?: string;
}

export interface AssetInput {
  assetId: string;
  assetName: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  departmentId: string;
  status: string;
  purchaseDate: string;
  description?: string;
}

export interface Position {
  positionId: string;
  positionName: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface DepartmentStatisticsDTO {
  departmentName: string;
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
}

export interface EmployeeStatisticsDTO {
  totalCompanyEmployees: number;
  departments: DepartmentStatisticsDTO[];
}
