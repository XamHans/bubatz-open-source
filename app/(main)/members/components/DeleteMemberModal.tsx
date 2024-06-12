import { deleteMember } from '@/modules/members/data-access';
import { deleteMemberInput } from '@/modules/members/data-access/schema';
import { deleteMemberUseCase } from '@/modules/members/use-cases';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogClose,
} from '@radix-ui/react-dialog';
import { UUID } from 'crypto';
import { useAction } from 'next-safe-action/hooks';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';

interface DeleteMemberModalProps {
  firstName: string;
  lastName: string;
  open: boolean;
}

const DeleteMemberModal: React.FC<DeleteMemberModalProps> = ({
  firstName,
  lastName,
  open,
}) => {
  const { execute } = useAction(deleteMemberUseCase, {
    onSuccess: () => {
      console.log('Member deleted successfully');
    },
    onError: (error) => {
      console.log('Error deleting member', error);
    },
  });

  const params = useParams<{ id: UUID }>();

  const handleDelete = async () => {
    const data: deleteMemberInput = { id: params.id };
    const result = await execute(data);
    console.log('deleted member', result);
  };

  const handleAbort = () => {
    console.log('Abort action');
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogDescription>
          <p>
            Are you sure you want to delete the member{' '}
            <strong>
              {firstName} {lastName}
            </strong>
            ?
          </p>
        </DialogDescription>
        <DialogClose asChild>
          <Button type="button" onClick={handleDelete}>
            Delete
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="button" onClick={handleAbort}>
            Cancel
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export { DeleteMemberModal };
