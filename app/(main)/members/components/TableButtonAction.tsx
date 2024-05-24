'use client'

import { Button } from '@/components/ui/button'
import { psDeleteUserById } from '@/lib/db/prepared/statements'

const DeleteUserHandler = async (id: string) => {
    console.log('DeleteUserHandler', id)
    await psDeleteUserById.execute({ id: id })
}

export default function TableButtonAction({ id }: { id: string }) {
    return (
        <Button
            className="ml-2"
            size="icon"
            variant="default"
            onClick={() => DeleteUserHandler(id)}
        >
            <span className="">D</span>
        </Button>
    )
}
