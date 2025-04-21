export interface Job {
  id: string;
  company_id: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  job_type: string;
  applications?: {
    id: string;
    user_id: string;
    job_id: string;
    status: "pending" | "accepted" | "rejected";
    created_at: string;
    updated_at: string;
  }[];
}

export interface Company {
  id: string;
  company_name: string;
  company_description: string;
  company_website: string;
  company_email: string;
  company_phone: string;
  company_address: string;
  company_city: string;
  company_country: string;
}
