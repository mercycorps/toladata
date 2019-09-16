import React from 'react';

const HeaderCell = ({ label }) => {
    return (
        <th className="text-nowrap">
            { label }
        </th>
    );
}

const HeaderRow = ({ headers }) => {
    return (
        <thead>
            <tr className="logframe__table__header">
                { headers.map((label, idx) => <HeaderCell label={ label } key={ idx } />) }
            </tr>
        </thead>
    );
}

export default HeaderRow;
