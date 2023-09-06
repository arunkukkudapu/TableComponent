import React, { useEffect, useState } from "react";
import axios from "axios";
import TableHead from "./TableHead.tsx";

const CustomTable = () => {
  const [columns] = useState(['Id', 'Brand', 'Stock', 'Rating', 'Price', 'Category']);
  const [list, setList] = useState([]);
  const [perManenentlist, setPermanaentList] = useState([]);
  const [columnFilters, setColumnFilters] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemsPerPage] = useState(5);
  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    axios.get('https://dummyjson.com/products').then((res) => {
      setList(res.data.products);
      setPermanaentList(res.data.products)
      setFilteredData(res.data.products)
      const startIndex = (currentPage - 1) * itemPerPage;
      const endIndex = startIndex + itemPerPage;
      const pageData = res.data.products.slice(startIndex, endIndex);
      setList(pageData);
    }).catch((err) => {
      console.log(err)
    })
    let newObj = {}
    columns.forEach((col) => {
      newObj = { ...newObj, [col.toLowerCase()]: [] }
    })
    setColumnFilters(newObj);
  }, [])

  useEffect(() => {
    applyFilter();
  }, [columnFilters, globalFilter, currentPage, itemPerPage])

  const getColumnFilterOptions = (col) => {
    const options = new Set();
    perManenentlist.forEach((item) => {
      options.add(item[col].toString());
    })
    return Array.from(options);
  }
  const handleColumnFilterChange = (e, column, value) => {
    const newColumnFilters = { ...columnFilters };
    if (e.target.checked) {
      newColumnFilters[column] = [...newColumnFilters[column], value]
    } else {
      newColumnFilters[column] = newColumnFilters[column].filter((item) => item !== value)
    }
    setColumnFilters(newColumnFilters);
    setCurrentPage(1)
  }
  const applyFilter = () => {
    debugger;
    let filteredData = [...perManenentlist];
    if (globalFilter.length > 3) {
      debugger;
      filteredData = filteredData.filter((item) => {
        return Object.keys(item).some((key) =>
          item[key].toString().toLowerCase().includes(globalFilter.toLowerCase())
        )
      })
    }

    Object.keys(columnFilters).forEach((col) => {
      if (columnFilters[col].length > 0) {
        filteredData = filteredData.filter((i) => {
          return columnFilters[col].includes(i[col].toString())
        })
      }
    })
    setFilteredData(filteredData)
    debugger;
    const startIndex = (currentPage - 1) * itemPerPage;
    const endIndex = startIndex + itemPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);
    setList(pageData);
  }
  const handleSelectedRow = (id) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(id)) {
      newSelectedRows.delete(id);
    } else {
      newSelectedRows.add(id);
    }
    setSelectedRows(newSelectedRows);
  }
  const handleDeleteRow = () => {
    const newList = list.filter((item) => !selectedRows.has(item.id));
    setList(newList);
    setSelectedRows(new Set());
  }
  return (
    <>
      <input type="text" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} />
      <table style={{ padding: '10px' }}>
        {/* <tr style={{ padding: '10px' }}>
          <th /> */}
          <TableHead perManenentlist={perManenentlist} columnFilters={columnFilters} getColumnFilterOptions={getColumnFilterOptions} handleColumnFilterChange={handleColumnFilterChange} columns={columns} />
          {/* {columns.map((ite) => {
            return <th style={{ padding: '10px' }}>{ite}
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  filter
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {perManenentlist.length > 0 && Object.keys(columnFilters).length > 0 && getColumnFilterOptions(ite.toLowerCase()).map((op) => (
                    <div>
                      <input type="checkbox" checked={columnFilters[ite.toLowerCase()].includes(op)} onChange={(e) => handleColumnFilterChange(e, ite.toLowerCase(), op)} />
                      {op}
                    </div>
                    // )
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </th>
          })}
        </tr> */}
        <tbody>
          {list.length > 0 && list.map((it) => {
            const row = columns.map((ita, index) => {
              return <td key={index} style={{ padding: '10px' }}>{it[ita.toLowerCase()]}</td>
            })
            return <tr key={it.id} style={{ padding: '10px' }}><td><input type="checkbox" checked={selectedRows.has(it.id)} onChange={() => handleSelectedRow(it.id)} /></td>{row}</tr>
          })}

        </tbody>

      </table>
      <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
      <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= Math.ceil(filteredData.length / itemPerPage)}>Next</button>
      <button onClick={handleDeleteRow}>delete</button>
      <p>page No: {currentPage}</p>
      <span>No. of Records per page </span><input type="number" value={itemPerPage} onChange={(e)=> setItemsPerPage(parseInt(e.target.value))}/>
    </>
  )
}

export default CustomTable;