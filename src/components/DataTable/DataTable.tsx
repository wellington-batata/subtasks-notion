"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import { Button } from "../ui/button"
import { splitTaskByWeekDay } from "@/app/api/notion/parser";
import { TaskProps } from "@/app/types/task"
import { SubTask } from "@/app/types/subtask"
import { TimeController } from "@/lib/utils"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}


export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {

  const [rowSelection, setRowSelection] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Inicialmente desabilitado

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      // sorting,
      // columnFilters,
      // columnVisibility,
      rowSelection,
    }
  })

  const handleButtonClick = async () => {
    const selectedRowData = table.getSelectedRowModel().rowsById;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let subTasks: SubTask[] = [];
    
    for (const rowId in selectedRowData) {
      const row = selectedRowData[rowId];
      const subs = splitTaskByWeekDay(row.original as TaskProps);

      subs.forEach((sub)=>{
        subTasks.push(sub);
      });

    }
    console.log(JSON.stringify(subTasks))
    const options = {
      method: "POST",
      body: JSON.stringify(subTasks),
      headers: myHeaders,
    }
    const timer = new TimeController();
    timer.start();
    const response = await fetch(`/api/notion`, options);
    const executionTime = timer.stop();
    if (executionTime !== null) {
        console.log(`Tempo de execução: ${executionTime}ms`);
    }
    if (!response.ok) throw new Error(`Failed to fetch data Substask ID: ${response}`);
  };

  return (
    <div className="rounded-md border">
      <p className="w-full text-right p-4">
        <Button onClick={handleButtonClick}>
          Subtasks
        </Button>
      </p>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup: any) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header: any) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
    </div>
  )
}
