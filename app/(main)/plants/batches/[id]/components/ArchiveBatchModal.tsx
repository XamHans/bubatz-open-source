'use client'

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
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { siteConfig } from '@/config/site'
import { updateBatchUseCase } from '@/modules/plants/use-cases'
import { useAction } from 'next-safe-action/hooks'
import { useRouter } from 'next/navigation'

export interface ArchiveBatchModalProps {
  id: string
}

const ArchiveBatchModal = ({ id }: ArchiveBatchModalProps) => {
  const { toast } = useToast()
  const router = useRouter()

  const { execute } = useAction(updateBatchUseCase, {
    onSuccess: (data) => {
      toast({
        title: 'Batch archived',
        description: 'The batch has been successfully archived',
      })
      setTimeout(() => {
        router.push(`${siteConfig.links.plants.index}`)
      }, 1500)
    },
    onError: (error) => {
      console.error('Failed to archive batch:', error)
      toast({
        title: 'Batch archived',
        description: 'The batch has been successfully archived',
        variant: 'destructive',
      })
    },
  })

  const handleArchive = () => {
    execute({ id: id, isArchived: true })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Archive Batch</CardTitle>
        <CardDescription>
          When you're done with the batch, you can archive it here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="secondary">
              Archive Batch
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will archive the current batch. You can't undo this
                action.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleArchive}>
                Yes, archive it
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}

export default ArchiveBatchModal
