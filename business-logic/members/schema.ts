import { boolean, date, pgTable, serial, text } from "drizzle-orm/pg-core";

export const members = pgTable('profiles', {
  id: serial('id').primaryKey(),
  
  // general info
  firstName: text('first_name'),
  lastName: text('last_name'),
  birthDay: date('birthday'),
  // contact
  email: text('email'),
  phone: text('phone'),
  // address
  street: text('street'),
  city: text('city'),
  zip: text('zip'),
  //club info
  status: text('member_status'),
  isAdmin: boolean('is_admin'),
});
