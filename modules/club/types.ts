

export enum ClubMemberStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  REQUEST = "REQUEST",
  PAUSED = "PAUSED",
  EXITED = "EXITED",
}

export enum ClubStatus {
  IN_FOUNDATION = "IN_FOUNDATION",
  ESTABLISHED = "ESTABLISHED",
}
export enum PaymentPaidVia {
  CASH = "CASH",
  WIRE = "WIRE",
  DEBIT = "DEBIT",
  OTHER = "OTHER",
}

export interface ClubProps {
  id: string;
  name: string;
  description: string;
  street: string;
  city: string;
  zip: string;
  email: string;
  phone: string;
  birthday: Date | string;
  first_owner: string;
  status: ClubStatus | string;
  terms_url?: string;
  avatar_url?: string;
  cover_img_url?: string;
}

export interface ClubPaymentProps {
  id: string;
  club_id: string;
  profile_id: string;
  amount: number;
  comment: string;
  status: PaymentStatus | string;
  paid_via: PaymentPaidVia | string;
  due_at: Date | string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface ClubMemberRelationProps {
  id: string;
  club_id: string;
  profile_id: string;
}

export enum ClubCostInterval {
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export enum PaymentStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
  PENDING = "PENDING",
}

export type ClubCostProps = {
  id: string;
  club_id: string;
  issued_by: string;
  amount: number;
  comment: string;
  due_at?: Date | string;
  paid_via: PaymentPaidVia | string;
  invoice_url?: string;
  status: PaymentStatus | string;
  created_at: Date | string;
  updated_at: Date | string;
};

export type ClubRecurringCostProps = {
  id: string;
  name: string;
  club_id: string;
  comment: string;
  issued_by: string;
  amount: number;
  interval: ClubCostInterval | string;
  active: boolean;
  start_date: Date | string;
  end_date: Date | string;
  next_due_date: Date | string;
  created_at: Date | string;
  updated_at: Date | string;
};



import { z } from "zod";

export const updateClubSchema = z.object({
  name: z.string().min(3, { message: "Name des CSC's ist erforderlich" }),
  description: z.string().default("").optional(),

  email: z.string().email({ message: "Email ist erforderlich" }),
  phone: z.string().default("").optional(),

  zip: z.string().min(3, { message: "PLZ ist erforderlich" }),
  city: z.string().min(3, { message: "Ort ist erforderlich" }),

  street: z.string().min(3, { message: "Straße ist erforderlich" }),
  status: z.string().default("VERFICATION_PENDING"),
  birthday: z

    .date()
    .min(new Date(1900, 0, 1), {
      message: "Gründungstag kann nicht vor 1980 liegen",
    })
    .max(new Date(), {
      message: "Gründungstag kann nicht in der Zukunft liegen",
    }),

  avatar_url: z.string().default("").optional(),
  cover_img_url: z.string().default("").optional(),

  // terms: z
  //   .instanceof(File)
  //   .refine((value) => {
  //     // Add your validation logic here
  //     // Example: Check if the value is a file and has a .pdf extension
  //     return value instanceof File && value.name.endsWith(".pdf");
  //   }, "Keine gültige PDF Datei ausgewählt")
  //   .optional(),
});

type UpdateClubInput = z.TypeOf<typeof updateClubSchema>;

export type UpdateClubDTO = Partial<UpdateClubInput> & {
  id: string;
  terms_url?: string;
};
