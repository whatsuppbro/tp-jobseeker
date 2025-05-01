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

export interface JobwithCompany {
  id: string;
  company_id?: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  job_type: string;
  image_url: string;
  company: {
    company_name: string;
    company_description: string;
    company_website: string;
    company_email: string;
    company_phone: string;
    company_address: string;
    company_city: string;
    company_country: string;
    image_url: string;
  };
  applications: {
    id: string;
    user_id: string;
    name: string;
    email: string;
    status: "pending" | "accepted" | "rejected";
  }[];
}

export interface Company {
  id: string;
  company_id: string;
  company_name: string;
  company_description: string;
  company_website: string;
  company_email: string;
  company_phone: string;
  company_address: string;
  company_city: string;
  company_country: string;
  image_url: string;
}

export interface Applicant {
  id: string;
  job_id: string;
  user_id: string;
  status: string;
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    seeker: {
      id: string;
      user_id: string;
      avatar_url: string;
      resume_url: string;
      phonenumber: string;
      address: string;
      city: string;
      certificates: string;
      experience: {
        id: string;
        seeker_id: string;
        company_name: string;
        position: string;
        description: string;
        experience_years: string;
      };
      skills: { id: string; seeker_id: string; name: string }[];
      education: {
        id: string;
        seeker_id: string;
        school_name: string;
        degree: string;
        field_of_study: string;
        start_date: string;
        end_date: string;
      };
    };
  };
}

export interface JobApplication {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  image_url: string;
  job_type: string;
  company: {
    company_name: string;
  };
  applications: {
    id: string;
    name: string;
    email: string;
    status: "pending" | "accepted" | "rejected";
    user: {
      id: string;
      firstname: string;
      lastname: string;
      email: string;
    };
  }[];
}

export interface User {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  role: "seeker" | "company";
  company?: {
    id?: string;
    company_name?: string;
    company_description?: string;
    company_website?: string;
    company_email?: string;
    company_phone?: string;
    company_address?: string;
    company_city?: string;
    company_country?: string;
    image_url?: string;
  };
}

export interface Seeker {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  role: "seeker" | "company";
  seeker?: {
    id?: string;
    phonenumber?: string;
    address?: string;
    city?: string;
    resume_url?: string;
    avatar_url?: string;
  };
}

export interface ApplicationCompany {
  id: string;
  status: "pending" | "accepted" | "rejected";
  job_id: string;
  user_id: string;
  applied_at?: string;
  job: {
    id: string;
    title: string;
    description: string;
    location: string;
    salary: number;
    job_type: string;
    company: {
      company_name: string;
      company_description: string;
      company_location: string;
      company_address: string;
      company_email: string;
      company_phone: string;
      company_website: string;
    };
  };
}

export interface AllUserDetail {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  role: "seeker" | "company";
  applications?: [
    {
      id: string;
      job_id: string;
      status: "pending" | "accepted" | "rejected";
      job?: {
        id: string;
        title: string;
        description: string;
        location: string;
        salary: string;
        job_type: string;
      };
    }
  ];
  seeker?: {
    id: string;
    phonenumber?: string;
    address?: string;
    city?: string;
    resume_url?: string;
    avatar_url?: string;
    certificates?: string;
    education?: {
      id?: string;
      school_name?: string;
      degree?: string;
      field_of_study?: string;
      start_date?: string;
      end_date?: string;
    };
    experience?: {
      id?: string;
      company_name?: string;
      position?: string;
      experience_years?: string;
      description?: string;
    };
    skills?: {
      id?: string;
      name?: string;
    }[];
  };
  company_name?: string;
  position?: string;
  description?: string;
}

export interface ApplicantionByUser {
  id: string;
  job_id: string;
  user_id: string;
  status: "pending" | "accepted" | "rejected";
  applied_at?: string;
  job: {
    title: string;
    description: string;
    location: string;
    salary: number;
    job_type: string;
    company: {
      company_name: string;
      company_description: string;
      company_location: string;
      company_address: string;
      company_email: string;
      company_phone: string;
      company_website: string;
    };
  };
  user: {
    firstname: string;
    lastname: string;
    email: string;
  };
}
