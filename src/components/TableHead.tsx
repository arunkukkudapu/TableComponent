import React, { memo } from 'react';
// import Dropdown from 'react-bootstrap/Dropdown';

const TableHead = ({ perManenentlist, columnFilters, handleColumnFilterChange, getColumnFilterOptions, columns }) => {
    return (
        <thead>
            <tr style={{ padding: '10px' }}>
                <th />
                {columns.map((ite, index) => {
                    return <th key={index} style={{ padding: '10px' }}>{ite}
                        <div className="btn-group">
                            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                                filter
                            </button>
                            <ul className="dropdown-menu dropdown-menu-height">
                                {perManenentlist.length > 0 && Object.keys(columnFilters).length > 0 && getColumnFilterOptions(ite.toLowerCase()).map((op, index) => (
                                    <li key={index} className="dropdown-item">
                                        <input type="checkbox" checked={columnFilters[ite.toLowerCase()].includes(op)} onChange={(e) => handleColumnFilterChange(e, ite.toLowerCase(), op)} />
                                        <span style={{ paddingLeft: '10px' }}>{op}</span>
                                    </li>
                                    // )
                                ))}
                            </ul>
                        </div>
                    </th>
                })}
            </tr>
        </thead>
    )
}

export default memo(TableHead);