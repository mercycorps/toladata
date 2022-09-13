import React, { useState } from 'react';
import Datepicker, {registerLocale} from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es';
registerLocale('es', es)

// const years = range(1990, getYear(new Date()) + 1, 1);
const years = [2015,2016,2018,2019,2020,2021,2022];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];


const ReactDatepicker = ({
    dateFormat,
    locale,
    className,
    date,
    minDate,
    maxDate,
    onChange,
    customDatesSelector
    }) => {
        console.log(date)
        console.log(window.localDateFromISOStr(date).getMonth())
        let selectedDate = window.localDateFromISOStr(date);
        console.log("selectedDate", months[selectedDate.getMonth()]);
    return (
        <Datepicker
            dateFormat={dateFormat || "yyyy-MM-dd"}
            locale={locale || window.userLang}
            className={className}
            selected={window.localDateFromISOStr(date)}
            minDate={minDate}
            maxDate={maxDate}
            onChange={onChange}
            renderCustomHeader={({
                date,
                changeYear,
                changeMonth,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
                }) => (
                    <div
                    style={{
                        margin: 10,
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                    >
                    <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} style={{border: "none"}}>
                        {"<"}
                    </button>

                    <select
                        value={selectedDate.getFullYear()}
                        onChange={({ target: { value } }) => changeYear(value)}
                    >
                        {years.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
            
                    <select
                        value={months[selectedDate.getMonth()]}
                        onChange={({ target: { value } }) =>
                        changeMonth(months.indexOf(value))
                        }
                    >
                        {months.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
            
                    <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} style={{border: "none"}}>
                        {">"}
                    </button>
                    </div>
                )}
        >
        </Datepicker>
    )
}

export default ReactDatepicker;
