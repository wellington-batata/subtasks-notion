"use client"

import { ColumnDef } from "@tanstack/react-table"
import { TaskProps } from "@/app/types/task";

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button";

import { truncateText, extractDaysWeek } from "@/lib/utils";

export const taskCols: ColumnDef<TaskProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "#ID",
    cell: ({ row }) => (
      truncateText(row.getValue('id'), 10)
    )
  },
  {
    accessorKey: "name",
    header: "Name",
  },
    {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "weekDay",
    header: "Week Day",
    cell: ({ row }) => (
      extractDaysWeek(row.getValue('weekDay'))
    )
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
  },
  {
    accessorKey: "endDate",
    header: "End Date",
  },
  {
    accessorKey: "estimatedTime",
    header: "Estimated Time (min)",
  },
  // {
  //   accessorKey: "status",
  //   header: "Status",
  //   cell: ({ row }) => (
  //     <Button onClick={() => test(row)}>BTN</Button> // I wanto to use {/owner} here
  //   ),
  // }
]
