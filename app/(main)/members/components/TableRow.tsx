import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { TableCell, TableRow } from '@/components/ui/table'
import { psDeleteUserById } from '@/lib/db/prepared/statements'
import * as React from 'react'
import TableButtonAction from './TableButtonAction'

interface RowProps {
    id: string
    name: string
    image: string
    status: string
}

const Row = ({ id, name, image, status }: RowProps) => {
    return (
        <TableRow id={`${id}`}>
            <TableCell>
                <Checkbox id="select-1" />
            </TableCell>
            <TableCell>
                <Avatar>
                    <AvatarImage alt="John Doe" src={`${image}`} />
                    <AvatarFallback>{`${image}`}</AvatarFallback>
                </Avatar>
            </TableCell>
            <TableCell className="font-medium">{`${name}`} </TableCell>
            <TableCell className="hidden md:table-cell">
                <Badge variant="default">{`${status}`}</Badge>
            </TableCell>
            <TableCell className="text-right">
                <Button size="icon" variant="default">
                    <span className="">V</span>
                </Button>
                <Button className="ml-2" size="icon" variant="default">
                    <span className="">E</span>
                </Button>
                <TableButtonAction id={id} />
            </TableCell>
        </TableRow>
    )
}

export default Row
