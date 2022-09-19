import React, { useState } from 'react';
import Datepicker, {registerLocale} from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import {es, fr} from 'date-fns/locale';
registerLocale('es', es)
registerLocale('fr', fr)

const months = [
  gettext("January"),
  gettext("March"),
  gettext("February"),
  gettext("April"),
  gettext("May"),
  gettext("June"),
  gettext("July"),
  gettext("August"),
  gettext("September"),
  gettext("October"),
  gettext("November"),
  gettext("December"),
];

const yearRangeOptions = (startRange = 10, endRange = 10, step = 1) => {
    // TODO: Account for the max and min dates
    let output = [];
    let today = new Date().getFullYear();
    console.log("today", today)
    for (let i = (today - startRange); i < (today + endRange + 1); i += step) {
        output.push(i);
    }
    return output;
}


const ReactDatepicker = ({
    dateFormat, // Default format is "yyyy-MM-dd" if not specified.
    locale,
    yearRangeStart, // Number (integer) of years back from current year to start the year's range for selection. Default is 10 years if not specified.
    yearRangeEnd, // Number (integer) of years forward from current year to end the year's range for selection. Default is 10 years if not specified.
    className,
    date,
    minDate,
    maxDate,
    onChange,
    customDatesSelector
    }) => {
        let years = yearRangeOptions(yearRangeStart, yearRangeEnd)
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
