import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import React, { ReactNode } from 'react';

interface GenericModalProps {
  headerTitle: string;
  description: string;
  children: ReactNode;
  onSave: () => void;
  onAbort: () => void;
}

const GenericModal: React.FC<GenericModalProps> = ({
  headerTitle,
  description,
  children,
  onSave,
  onAbort,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={onAbort}>{headerTitle}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{headerTitle}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogClose asChild>
          <Button type="button" onClick={onSave}>
            Save
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="button" onClick={onAbort}>
            Abort
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export { GenericModal };
