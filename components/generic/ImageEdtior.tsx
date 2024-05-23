import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import ImageCropper from '../ImageCropper';

export interface ImageEditorProps {
  title: string;
  description: string;
  avatar_url: string;
  club_id?: string;
  profile_id?: string;
}

const ImageEditor = ({
  avatar_url,
  club_id,
  profile_id,
  title,
  description,
}: ImageEditorProps) => {
  const [urlOfNewImage, setImg] = useState(avatar_url);
  const { club } = useAuth();
  //   const { showSuccessToast, showErrorToast } = useToast()
  const { t } = useTranslation();
  const CLUB_AVATAR_PATH = `/${club_id ?? club?.id}/avatar.png`;
  const PROFILE_AVATAR_PATH = `/${profile_id}/avatar.png`;

  let cacheVersion = 1;

  function handleCroppedImage(blob: Blob) {
    // Logger.debug("ImageEditor : handleCroppedImage", blob)
    if (profile_id) {
      uploadProfileCroppedImage(blob);
    }
    uploadClubCroppedImage(blob);
  }

  const updateClubAvatar = async (url: string) => {
    //@ts-ignore
    await updateClubUseCase.execute({
      ...club,
      avatar_url: url,
    });
  };

  const setImageUrlFromUploadKey = () => {
    const { data } = supabaseClient.storage
      .from('clubs')
      .getPublicUrl(CLUB_AVATAR_PATH);
    cacheVersion += 1;
    const newImgUrl = data.publicUrl + `?version=${cacheVersion}`;
    setImg(newImgUrl);
    updateClubAvatar(newImgUrl);
  };

  async function uploadClubCroppedImage(blob: Blob) {
    if (!club) throw new Error('No club found, can not upload image');

    const file = new File([blob], 'image.png', { type: 'image/png' }); // Cast Blob to File

    uploadService
      .uploadFile({
        file,
        path: CLUB_AVATAR_PATH,
        bucket: 'clubs',
      })
      .then((result) => {
        Logger.debug('ImageEditor : uploadResult', result);
        if (result.isLeft()) {
          //@ts-ignore
          showErrorToast(t('GENERAL.ACTIONS.EDIT_IMAGE_ERROR'));
        } else {
          showSuccessToast(t('GENERAL.ACTIONS.EDIT_IMAGE_SUCCESS'));
          setImageUrlFromUploadKey();
        }
      })
      .catch((error) => {
        //@ts-ignore
        showErrorToast(t('CLUB.UPLOAD_TERMS_ERROR'));
        console.log('ERROR:', error);
      });
  }

  const updateProfileAvatar = async (url: string) => {
    const updateProfileAvatar = await updateMemberUseCase.execute({
      avatar_url: url,
      id: profile_id!,
    });
    if (updateProfileAvatar.isLeft()) {
      //@ts-ignore
      showErrorToast(t('GENERAL.ACTIONS.EDIT_IMAGE_ERROR'));
    }
  };

  //@ts-ignore
  async function uploadProfileCroppedImage(blob) {
    if (!club) throw new Error('No club found, can not upload image');

    uploadService
      .uploadFile({
        file: blob,
        path: PROFILE_AVATAR_PATH,
        bucket: Buckets.PROFILES,
      })
      .then(async (result) => {
        Logger.debug('ImageEditor : uploadResult', result);
        if (result.isLeft()) {
          //@ts-ignore
          showErrorToast(t('GENERAL.ACTIONS.EDIT_IMAGE_ERROR'));
        } else {
          showSuccessToast(t('GENERAL.ACTIONS.EDIT_IMAGE_SUCCESS'));
          const { data } = supabaseClient.storage
            .from(Buckets.PROFILES)
            .getPublicUrl(`/${profile_id}/avatar.png`);

          cacheVersion += 1;
          const newImgUrl = data.publicUrl + `?version=${cacheVersion}`;
          console.log({ newImgUrl });
          setImg(newImgUrl);
          updateProfileAvatar(newImgUrl);
        }
      })
      .catch((error) => {
        //@ts-ignore
        showErrorToast(t('CLUB.UPLOAD_TERMS_ERROR'));
        console.log('ERROR:', error);
      });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-24 bg-white hover:bg-white dark:bg-inherit dark:hover:bg-current">
          <AvatarAnimated image={urlOfNewImage} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:min-w-[80%]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <ImageCropper onCropComplete={handleCroppedImage} />
      </DialogContent>
    </Dialog>
  );
};

export const AvatarAnimated = ({ image }: { image: string }) => {
  return (
    <>
      <AnimatePresence>
        <motion.div
          className="h-24 w-24 cursor-pointer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <Avatar className="h-24 w-24">
            <AvatarImage src={image} />
            <AvatarFallback></AvatarFallback>
          </Avatar>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export { ImageEditor };
