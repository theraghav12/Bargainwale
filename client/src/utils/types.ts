export interface CategoryDropdownProps {
  state: string;
  city: string;
}

export interface OrderFormData {
  companyBargainDate?: string;
  item: {
    type?: "oil" | "box" | "tin";
    category?: "box" | "tin";
    oilType?: "palmOil" | "vanaspatiOil" | "soybeanOil";
  };
  companyBargainNo?: string;
  location: {
    state?: string;
    city?: string;
  };
  staticPrice?: number;
  quantity?: number;
  weightInMetrics?: number;
  status?: "created" | "billed" | "payment pending" | "completed";
  description?: string;
  createdAt?: Date;
  billedAt?: Date;
  warehouse?: string | null;
  organization?: string;
}

export interface Warehouse {
  _id: string;
  name: string;
  state: string;
  city: string;
}
