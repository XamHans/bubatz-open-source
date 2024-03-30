"use client";

import { GenericModal } from "@/app/components/GenericModal";
import { ClubMemberStatus } from "@/business-logic/members/types";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { t } from "i18next";
import { useForm } from "react-hook-form";



const AddMemberModal = () => {

const form = useForm({
    mode: "onChange",
    // resolver: zodResolver(addMemberToClubSchema),
  })

const onSubmit = async (data) => {
    console.log(data);
  }


  const handleSave = () => {
    console.log('Save action');
  };

  const handleAbort = () => {
    console.log('Abort action');
  };

  return (
  <GenericModal
        headerTitle="Add Member"
        description="Fill in the details to add a new member."
        onSave={handleSave}
        onAbort={handleAbort}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid sm:grid-cols-2 gap-2 md:gap-4"
          >
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("MEMBER.FIRST_NAME")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                    
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("MEMBER.LAST_NAME")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("GENERAL.PHONE")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="birthday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("MEMBER.BIRTHDAY")}</FormLabel>
                  <FormControl>
                    <DatePicker
                      initialVale={field.value}
                      onSelect={handleChange}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("MEMBER.ZIP")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("MEMBER.CITY")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("MEMBER.STREET")}</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter street" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="member_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("MEMBER.STATUS")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={ClubMemberStatus.REQUEST}>
                        {t("MEMBER.STATUS_OPTIONS.REQUEST")}
                      </SelectItem>
                      <SelectItem value={ClubMemberStatus.PENDING}>
                        {t("MEMBER.STATUS_OPTIONS.PENDING")}
                      </SelectItem>
                      <SelectItem value={ClubMemberStatus.ACTIVE}>
                        {t("MEMBER.STATUS_OPTIONS.ACTIVE")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <DialogFooter className="col-span-2">
              <DialogClose asChild>
                <Button type="submit" disabled={!form?.formState?.isValid}>
                  {" "}
                  {t("GENERAL.ACTIONS.SAVE")}
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </GenericModal>
  );
  
}

export { AddMemberModal };

