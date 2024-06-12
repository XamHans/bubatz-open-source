import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import React, { ReactNode } from 'react';

interface GenericSheetProps {
  headerTitle: string;
  description: string;
  children: ReactNode;
  onSave: () => void;
  onAbort: () => void;
}

const GenericSheet: React.FC<GenericSheetProps> = ({
  headerTitle,
  description,
  children,
  onSave,
  onAbort,
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button onClick={onAbort}>{headerTitle}</Button>
      </SheetTrigger>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>{headerTitle}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        {children}
        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onAbort}>
            Abort
          </Button>
          <Button type="button" onClick={onSave}>
            Save
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export { GenericSheet };
