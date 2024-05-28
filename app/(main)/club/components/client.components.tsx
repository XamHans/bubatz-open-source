'use client';

import configuration from '@/app/configuration';
import {
  ClubProps,
  ClubStatus,
  UpdateClubDTO,
  updateClubSchema,
} from '@/business-logic/club/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { Form, SubmitHandler, useForm } from 'react-hook-form';

const ClubImageAndTerms = ({ club, user }: { club: ClubProps; user: User }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [coverImg, setCoverImg] = useState<File | null>(null);
  const { name } = club;
  const [clubTermsUrl, setClubTermsUrl] = useState<string>('');
  // const { showSuccessToast, showErrorToast } = useToast()

  const handleTermsInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files && event.target.files[0];
    setSelectedFile(file || null);
  };

  const handleCoverImgInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files && event.target.files[0];
    setCoverImg(file || null);
  };

  async function getTermsUrl() {
    // const preSignedUrlResult = await uploadService.createSignedUrl(
    //   "club_assets",
    //   club.id + "/satzung.pdf"
    // )
    // if (preSignedUrlResult.isLeft()) return
    // setClubTermsUrl(preSignedUrlResult.value)
  }

  const updateClubWithNewTermsUrl = async (url: string) => {
    //@ts-ignore
    const updateClubResult = await updateClubUseCase.execute({
      ...club,
      terms_url: url,
    });
    if (updateClubResult.isLeft()) {
      console.log('updateClubResult ERROR:', updateClubResult.value);
    }
  };

  const handleUpload = async ({
    file,
    path,
    translationKey,
  }: {
    file: File | null;
    path: string;
    translationKey: string;
  }) => {
    if (file) {
      // const uploadResult = await uploadService.uploadFile({
      //   file: file,
      //   path: path,
      //   bucket: "clubs",
      // })
      // if (uploadResult.isLeft()) {
      //   //@ts-ignore
      //   showErrorToast(t(translationKey))
      // } else {
      //   showSuccessToast(t(translationKey))
      // }
      // return right(uploadResult.value)
    } else {
      // return left("No file selected.")
    }
  };

  const onTermsUploadButtonClick = async () => {
    const uploadResult = await handleUpload({
      file: selectedFile,
      path: `/${club.id}/satzung.pdf`,
      translationKey: 'CLUB.UPLOAD_TERMS_SUCCESS',
    });
    // if (uploadResult.isLeft()) {
    //   //@ts-ignore
    //   throw new FrontendError(uploadResult.value)
    // }
    //@ts-ignore
    updateClubWithNewTermsUrl(uploadResult.value);
    getTermsUrl();
  };

  const onCoverImgUploadButtonClick = async () => {
    const uploadResult = await handleUpload({
      file: coverImg,
      path: `/${club.id}/coverImg.png`,
      translationKey: 'CLUB.UPLOAD_COVERIMG_SUCCESS',
    });

    // if (uploadResult.isRight()) {
    //   const { data } = supabaseClient.storage
    //     .from("clubs")
    //     .getPublicUrl(`/${club.id}/coverImg.png`)

    //   //@ts-ignore
    //   const updateClubResult = await updateClubUseCase.execute({
    //     ...club,
    //     cover_img_url: data.publicUrl,
    //   })

    //   updateClubResult.isLeft() &&
    //     showErrorToast(updateClubResult.value.message)
    // }
  };

  useEffect(() => {
    getTermsUrl();
  }, []);

  return (
    <section className="max-w-5xl sm:grid sm:grid-cols-2">
      <div className="items-center justify-center space-x-4 sm:flex">
        {/* <ImageEditor
          title={t("GENERAL.ACTIONS.EDIT_IMAGE")}
          description={t("GENERAL.ACTIONS.EDIT_IMAGE_DESCRIPTION", {
            context: "Club",
          })}
          avatar_url={club.avatar_url ?? ""}
          club_id={club.id}
        /> */}
        <a
          href={configuration.paths.members.replace(':id', club.id.toString())}
          target="_blank"
          rel="noopener noreferrer"
        >
          {' '}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <h3 className="flex-auto  text-2xl font-bold text-gray-900 hover:text-primary dark:text-white">
                  {name}
                </h3>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('CLUB.LANDING_PAGE')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </a>
      </div>
      <Tabs defaultValue="terms">
        <TabsList>
          <TabsTrigger value="terms">{t('CLUB.TERMS')}</TabsTrigger>
          <TabsTrigger value="coverimg">{t('CLUB.COVER_IMG')}</TabsTrigger>
        </TabsList>
        <TabsContent value="terms">
          <div className="flex items-end gap-x-4">
            <div className="w-full">
              <Label className="text-muted-foreground" htmlFor="file">
                {t('CLUB.PICK_TERMS')}
              </Label>
              <Input
                className="cursor-pointer"
                onChange={handleTermsInputChange}
                id="terms"
                type="file"
              />
            </div>
            <Button
              disabled={!user.email_confirmed_at}
              onClick={() => {
                onTermsUploadButtonClick();
              }}
              type="button"
            >
              {t('GENERAL.ACTIONS.UPLOAD')}
            </Button>
          </div>
          {clubTermsUrl && (
            <div className="flex items-center py-2 text-sm">
              <Badge>
                {' '}
                <a
                  className="text-lime hover:text-primay-600 cursor-pointer font-bold"
                  target="_blank"
                  href={clubTermsUrl}
                  rel="noopener noreferrer"
                >
                  {t('CLUB.TERMS')}.pdf
                </a>{' '}
              </Badge>
            </div>
          )}
        </TabsContent>
        <TabsContent value="coverimg">
          <div className="flex items-end gap-x-4">
            <div className="w-full">
              <Label className="text-muted-foreground" htmlFor="file">
                {t('CLUB.PICK_COVERIMG')}
              </Label>
              <Input
                className="cursor-pointer"
                onChange={handleCoverImgInputChange}
                id="coverimg"
                type="file"
              />
            </div>

            <Button
              onClick={() => {
                onCoverImgUploadButtonClick();
              }}
              type="button"
            >
              {t('GENERAL.ACTIONS.UPLOAD')}
            </Button>
          </div>
          {club?.cover_img_url && (
            <div className="flex items-center py-2 text-sm">
              <Badge>
                {' '}
                <a
                  className="text-lime hover:text-primay-600 cursor-pointer font-bold"
                  target="_blank"
                  href={club?.cover_img_url}
                  rel="noopener noreferrer"
                >
                  {t('CLUB.COVER_IMG')}.png
                </a>{' '}
              </Badge>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
};

const ClubForm = ({ club }: { user: User; club: ClubProps }) => {
  const form = useForm<UpdateClubDTO>({
    mode: 'onBlur',
    resolver: zodResolver(updateClubSchema),
    defaultValues: {
      name: club.name,
      description: club.description,
      email: club.email,
      status: club.status,
      phone: club.phone,
      birthday: new Date(club.birthday),
      zip: club.zip,
      city: club.city,
      street: club.street,
    },
  });
  // const { showSuccessToast, showErrorToast } = useToast()

  const handleDateChange = (selectedDate: string) => {
    if (!selectedDate) return;

    form.setValue('birthday', new Date(selectedDate), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit: SubmitHandler<UpdateClubDTO> = async (data) => {
    // Logger.debug(`The club form works! Your s: ${data}`)
    //@ts-ignore

    const updateClubResult = await updateClubUseCase.execute({
      ...data,
      id: club.id,
    });
    if (updateClubResult.isLeft()) {
      //@ts-ignore
      showErrorToast(t('CLUB.UPDATE_CLUB_ERROR'));
    } else {
      // showSuccessToast(t("CLUB.UPDATE_CLUB_SUCCESS"))
    }
  };

  return (
    <section className="max-w-5xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0"
        >
          {/* Address Details */}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('ONBOARDING.STEP_3.NAME')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('MEMBER.STREET')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('MEMBER.ZIP')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('MEMBER.CITY')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('CLUB.STATUS')}</FormLabel>
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
                    <SelectItem value={ClubStatus.IN_FOUNDATION}>
                      {t('CLUB.STATUS_OPTIONS.IN_FOUNDATION')}
                    </SelectItem>
                    <SelectItem value={ClubStatus.ESTABLISHED}>
                      {t('CLUB.STATUS_OPTIONS.ESTABLISHED')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthday"
            render={({ field }) => (
              <FormItem className="p-2">
                <FormLabel className="block">
                  {t('ONBOARDING.STEP_3.BIRTH')}
                </FormLabel>
                <FormControl>
                  <DatePicker
                    initialVale={field.value}
                    onSelect={handleDateChange}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator className="col-span-2 mb-2 mt-2" />
          {/* Contact Details */}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel> {t('ONBOARDING.STEP_3.EMAIL')} </FormLabel>
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
                <FormLabel> {t('ONBOARDING.STEP_3.PHONE')} </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator className="col-span-2 mb-2 mt-2" />

          {/* Club Description Details */}
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="block">
                  <FormLabel> {t('CLUB.DESCRIPTION_TEXT')} </FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter className="col-span-2">
            <Button type="submit">{t('GENERAL.ACTIONS.SAVE')}</Button>
          </DialogFooter>
        </form>
      </Form>
    </section>
  );
};

export { ClubForm, ClubImageAndTerms };
