

export interface User {
  id: string,
  full_name: string,
  email: string,
  phone_number: string,
  profile_image: string, 
  is_verified: boolean
}

export interface registrationDetails{
  full_name: string,
  email: string,
  phone_number: string,
  password: string, 
  confirm_password: string,
}