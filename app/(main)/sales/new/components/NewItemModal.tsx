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
import React, { ReactNode, useState } from 'react';
import { set } from 'zod';

interface GenericModalProps {
  headerTitle: string;
  description: string;
  children: ReactNode;
  onSave: () => boolean;
  onAbort: () => void;
  hasError?: boolean;
}

const GenericModal: React.FC<GenericModalProps> = ({
  headerTitle,
  description,
  children,
  onSave,
  onAbort,
  hasError,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={onAbort}>{headerTitle}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{headerTitle}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <Button
          type="submit"
          onClick={() => {
            if (onSave()) setOpen(false); // Close the modal only if the save was successful
          }}
        >
          Save
        </Button>
        <DialogClose asChild>
          <Button type="button" onClick={onAbort}>
            Abort
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export { GenericModal as NewItemModal };
