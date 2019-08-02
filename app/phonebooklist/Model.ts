

export interface IPhoneBookList {
  items: IPhoneBook[];
}

export interface IPhoneBook {
  id: number;
  first_name: string;
  last_name: string;
  birthday: string;
  phonenumber: string;
}

