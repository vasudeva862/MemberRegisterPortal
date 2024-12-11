export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface ClaimInterface {
  id: string;
  createdDate: string;
  userID: string;
  claimID: Number;
  claimName: string;
  dependentName1: string;
  dateOfBirth1: string;
  dependentName2: string;
  dateOfBirth2: string;
}

export interface UserDetailsInterface {
  id: string;
  createdDate: string;
  memberID: string;
  name: string;
  emailID: string;
  address: string;
  state: string;
  country: string;
  panNumber: string;
  contactNumber: string;
  dateOfBirth: string;
  age: Number;
  isActive: Boolean;
}
