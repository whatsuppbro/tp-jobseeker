export interface Company {
  id: string;
  company_name: string;
  company_email: string;
  company_phone: string;
  company_website: string;
  company_description: string;
  company_address: string;
  company_city: string;
  company_country: string;
  image_url?: string;
  is_verified: boolean;
  verified_at?: string;
} 