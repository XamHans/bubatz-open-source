'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { siteConfig } from '@/config/site';
import { deleteStrainUseCase } from '@/modules/plants/use-cases';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';

const DeleteStrainModal = ({ id }) => {
  const { toast } = useToast();
  const router = useRouter();

  const { execute } = useAction(deleteStrainUseCase, {
    onSuccess: (data) => {
      toast({
        title: 'Strain deleted',
        description: 'The Strain has been successfully deleted',
      });
      setTimeout(() => {
        router.push(`${siteConfig.links.plants.index}`);
      }, 1500);
    },
    onError: (error) => {
      console.error('Failed to archive batch:', error);
      toast({
        title: 'Error',
        description: `The Strain could not be deleted ${error}`,
        variant: 'destructive',
      });
    },
  });

  const handleDelete = () => {
    execute({ id: id });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete Strain</CardTitle>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="secondary">
              Delete Strain
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will delete the strain. You can't undo this action.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Yes, delete it
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default DeleteStrainModal;
