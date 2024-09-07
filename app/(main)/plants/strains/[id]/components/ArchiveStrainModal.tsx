/* eslint-disable react/no-unescaped-entities */
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
import { updateStrainUseCase } from '@/modules/plants/use-cases'
import { useAction } from 'next-safe-action/hooks'
import { useRouter } from 'next/navigation'

export interface ArchiveStrainModalProps {
  id: number
}

const ArchiveStrainModal = ({ id }: ArchiveStrainModalProps) => {
  const { toast } = useToast()
  const router = useRouter()

  const { execute } = useAction(updateStrainUseCase, {
    onSuccess: () => {
      toast({
        title: 'Strain archived',
        description: 'The Strain has been successfully archived',
      })
      setTimeout(() => {
        router.push(`${siteConfig.links.plants.index}`)
      }, 1500)
    },
    onError: (error) => {
      console.error('Failed to archive Strain:', error)
      toast({
        title: 'Strain archived',
        description: 'The Strain has been successfully archived',
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
        <CardTitle>Archive Strain</CardTitle>
        <CardDescription>
          When you're done with the Strain, you can archive it here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="secondary">
              Archive Strain
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will archive the current Strain. You can't undo this
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

export default ArchiveStrainModal
