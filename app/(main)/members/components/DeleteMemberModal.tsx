import { UUID } from 'crypto'
import { Trash2 } from 'lucide-react'
import React from 'react'
import { Button } from '../../../../components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from '../../../../components/ui/dialog'
import { deleteMember } from '../../../../modules/members/data-access'
import { UserSchema } from '../../../../modules/members/data-access/schema'

interface DeleteMemberModalProps {
  member: UserSchema
  setMembers: React.Dispatch<React.SetStateAction<UserSchema[]>>
}

const DeleteMemberModal: React.FC<DeleteMemberModalProps> = ({
  member,
  setMembers,
}) => {
  const handleDelete = async () => {
    const data = { id: member.id as UUID }
    const result = await deleteMember(data.id)
    console.log('deleted member', result)
    setMembers((prev) => prev.filter((m) => m.id !== data.id))
  }

  const handleAbort = () => {
    console.log('Abort action')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Trash2 className="h-6 w-6 cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogDescription>
          Are you sure you want to delete the member{' '}
          <strong>
            {member.firstName} {member.lastName}
          </strong>
          ?
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
  )
}

export { DeleteMemberModal }
