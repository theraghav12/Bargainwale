export interface CategoryDropdownProps {
  state: string;
  city: string;
}

export interface OrderFormData {
  companyBargainDate?: string;
  item: {
    name?: "oil" | "cement" | "brick"|"";
    packaging?: "box" | "tin"|"";
    type?: "palmOil" | "vanaspatiOil" | "soybeanOil"|"";
    staticPrice?: number;
    quantity?: number;
    weight?:number;
  };
  companyBargainNo?: string;
  sellerLocation: {
    state?: string;
    city?: string;
  };
  weightInMetrics?: number;
  transportLocation?:string;
  transportType?:string;
  status?: "created" | "billed" | "payment pending" | "completed";
  description?: string;
  warehouse?: string|null;
  organization?: string;
}

export interface Warehouse {
  _id: string;
  name: string;
  state: string;
  city: string;
}
