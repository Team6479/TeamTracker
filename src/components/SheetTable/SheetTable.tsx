import React, { useContext } from 'react';
import { PrimaryContext } from '../contexts';
import { Table } from '../Table';

interface SheetTableProps {
  teamNum: number
}

export const SheetTable: React.FC<SheetTableProps> = (props) => {
  const primaryContext = useContext(PrimaryContext);
  const team = primaryContext.teams[props.teamNum];

  var columns = [];
  for (const column of team.displays.table) {
    const columnIndex = team.displays.table.indexOf(column);
    columns.push({
      Header: column.title,
      // TODO: Remove the ignore once support for Footer prop is added
      // @ts-ignore react-table types dont yet have Footer prop
      Footer: team.displays.tableFooter[columnIndex] ? `${team.displays.tableFooter[columnIndex].title} ${team.displays.tableFooter[columnIndex].value}` : "",
      accessor: team.displays.table.indexOf(column).toString(),
      width: 150
    })
  }

  // We are assuming every display is the same length
  var data = [];
  for (let i = 0; i < team.displays.table[0].value.length; i++) {
    var row: { [value: number]: any } = {}
    for (const column of team.displays.table) {
      var value = column.value[i]
      const columnIndex = team.displays.table.indexOf(column);
      row[columnIndex] = value;

      var length = 0;
      switch (typeof value){
        case "string":
          length = value.length;
          break;
        case "number":
          length = value.toString.length;
          break;
        default:
          break;
      }

      length *= 8; // Compensation because I dont understand pixels

      if (length > columns[columnIndex].width) {
        columns[columnIndex].width = length;
      }

    }
    data.push(row);
  }

  var height = Object.keys(data).length * 35

  return (<Table columns={columns} data={data} height={height > 300 ? 300 : height} />);
}
