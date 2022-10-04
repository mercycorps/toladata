import React from 'react';
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


const ReactDatepicker = ({
    dateFormat, // Default format is "yyyy-MM-dd" if not specified.
    locale,
    className,
    date,
    minDate,
    maxDate,
    onChange,
    customDatesSelector
    }) => {

        // Function to set up the range for the year picker
        const yearRangeOptions = (minDate, maxDate) => {
            let output = [];
            let startYear = minDate.getFullYear()
            let endYear = maxDate.getFullYear() + 1;
            for (let i = startYear; i < endYear; i++) output.push(i);
            return output;
        }

        // Function to convert a valid string date to an ISO formatted date.
        const formatDate = (date) => {
            if (!date) return "";
            try { return window.localDateFromISOStr(date); }
            catch { return date; }
        }

        // Component Variables
        let today = new Date();
        let selectedDate = formatDate(date) || today;
        let selectedMinDate = formatDate(minDate) || new Date(`${today.getFullYear() - 10}`, `${today.getMonth()}`, `${today.getDate()}`)
        let selectedMaxDate = formatDate(maxDate) || new Date(`${today.getFullYear() + 10}`, `${today.getMonth()}`, `${today.getDate()}`)
        let years = yearRangeOptions(selectedMinDate, selectedMaxDate)

    return (
        // TODO: Handle null dates
        <Datepicker
            dateFormat={dateFormat || "yyyy-MM-dd"}
            locale={locale || window.userLang}
            className={className}
            selected={formatDate(date) || ""}
            minDate={selectedMinDate}
            maxDate={selectedMaxDate}
            onChange={onChange}
            renderCustomHeader={({
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
