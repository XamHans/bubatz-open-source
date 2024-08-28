import { deleteMember } from '../../../../modules/members/data-access'
import {
  UserSchema,
  deleteMemberInput,
} from '../../../../modules/members/data-access/schema'
import { deleteMemberUseCase } from '../../../../modules/members/use-cases'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from '../../../../components/ui/dialog'
import { UUID } from 'crypto'
import { useAction } from 'next-safe-action/hooks'
import { useParams } from 'next/navigation'
import { Button } from '../../../../components/ui/button'
import { useRouter } from 'next/router'
import { Trash2 } from 'lucide-react'
import React from 'react'

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
