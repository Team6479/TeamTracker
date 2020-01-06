import React from "react";
import { useTable, Column, useFlexLayout, useResizeColumns } from "react-table";
import { FixedSizeList } from "react-window";
import AutoSizer from 'react-virtualized-auto-sizer'
import './Table.css'

interface TableProps {
  columns: Array<Column<{}>>;
  data: Array<{}>;
  height: number;
}

export const Table: React.FC<TableProps> = (props) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns: props.columns,
      data: props.data,
      // defaultColumn
    },
    useFlexLayout,
    useResizeColumns
  );

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <div
          {...row.getRowProps({
            style
          })}
          className="tr"
        >
          {row.cells.map(cell => {
            return (
              <div {...cell.getCellProps()} className="td">
                {cell.render("Cell")}
              </div>
            );
          })}
        </div>
      );
    },
    [prepareRow, rows]
  );

  // Render the UI for your table
  return (
    <div className="table" {...getTableProps()}>
      <div className="thead">
        {headerGroups.map(headerGroup => (
          <div className="tr" {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <div className="th" {...column.getHeaderProps()}>
                {column.render("Header")}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="tbody" {...getTableBodyProps()}>
        <AutoSizer disableHeight>
          {({width}) => (
            <FixedSizeList
            height={props.height}
            itemCount={rows.length}
            itemSize={35}
            width={width}
          >
            {RenderRow}
          </FixedSizeList>
          )}
        </AutoSizer>
      </div>

      <div className="tfoot">
        {footerGroups.map(group => (
          <div className="tr" {...group.getHeaderGroupProps()}>
            {group.headers.map(column => (
              <div className="td" {...column.getHeaderProps()}>
                {column.render("Footer")}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

