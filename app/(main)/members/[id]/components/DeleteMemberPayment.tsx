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
import { useToast } from '@/components/ui/use-toast';
import { deleteMemberPaymentUseCase } from '@/modules/members/use-cases';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';

export interface DeleteMemberPaymentProps {
  id: string;
}

const DeleteMemberPayment = ({ id }: DeleteMemberPaymentProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const { execute } = useAction(deleteMemberPaymentUseCase, {
    onSuccess: () => {
      toast({
        title: 'Payment deleted',
        description: 'The Payment has been successfully deleted',
      });
    },
    onError: (error) => {
      toast({
        title: 'Payment deleted',
        description: `${error}`,
        variant: 'destructive',
      });
    },
  });

  const handleDelete = () => {
    execute({ id });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="secondary">
          Delete Payment
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will delete the current Payment. You can't undo this
            action.
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
  );
};

export default DeleteMemberPayment;
