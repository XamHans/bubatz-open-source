'use client'

import { Checkbox } from '@/components/ui/checkbox'
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { ClientProps } from '@/modules/members/types'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import Row from './TableRow'

export default function MemberTable({ clients }: { clients: ClientProps[] }) {
    console.log('clients', clients)
    const router = useRouter()

    //  const {t} = await initializeI18nClient('en')

    return (
        <div className="border rounded-lg w-full">
            <div className="relative w-full overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[32px]">
                                <Checkbox id="select-all" />
                            </TableHead>
                            <TableHead className="w-[60px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden md:table-cell">
                                Status
                            </TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients.map((client, index) => (
                            <Row
                                key={index}
                                id={client.id as string}
                                name={client.email as string}
                                image={
                                    client.email
                                        .charAt(0)
                                        .toUpperCase() as string
                                }
                                status="FAKE_DATA"
                            />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
