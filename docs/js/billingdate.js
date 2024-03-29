function calculateBillingDate() {
    try {
        console.log("Calculating billing date");
        const startDateInput = document.getElementById("startDate");
        if (!startDateInput) {
            throw new Error("Null pointer reference: startDateInput is null");
        }
        const billingFrequencyInput = document.getElementById("billingFrequency");
        if (!billingFrequencyInput) {
            throw new Error("Null pointer reference: billingFrequencyInput is null");
        }
        const processingDateInput = document.getElementById("processingDate");
        if (!processingDateInput) {
            throw new Error("Null pointer reference: processingDateInput is null");
        }
        let result;

        const startDate = new Date(startDateInput.value);
        if (isNaN(startDate.getTime())) {
            throw new Error("Invalid date input: Start date is not a valid date");
        }
        const frequency = billingFrequencyInput.value === "monthly" ? 1 : billingFrequencyInput.value === "quarterly" ? 3 : 12;
        const processingDate = new Date(processingDateInput.value);
        if (isNaN(processingDate.getTime())) {
            throw new Error("Invalid date input: Processing date is not a valid date");
        }

        if (startDate.getTime() === processingDate.getTime()) {
            const nextBillingDate = formatDate(startDate);
            result = `Start: ${formatDate(startDate)}|Freq: ${frequency}|Proc: ${formatDate(processingDate)}|Next Bill: ${nextBillingDate}`;
        } else if (startDate < processingDate) {
            const nextBillingDate = calculateNextBillingDate(startDate, frequency, processingDate);
            result = `Start: ${formatDate(startDate)}|Freq: ${frequency}|Proc: ${formatDate(processingDate)}|Next Bill: ${nextBillingDate}`;
        } else {
            throw new Error("(Start date must be before processing date)");
        }

        console.log(result);
        addToResultLog(result);
    } catch (ex) {
        console.error("Error in calculateBillingDate():", ex);
    }
}

  
// calculate next billing date by calculating the number of months between the start date and processing date, rounding up if there is a remainder, and returning a date value that is greater than or equal to the user-supplied processing date
function calculateNextBillingDate(startDate, frequency, processingDate) {
    console.log("calculateNextBillingDate() called with", formatDate(startDate), frequency, formatDate(processingDate));
    let result;
    if (startDate instanceof Date && processingDate instanceof Date && frequency > 0) {
        console.log("Start date and processing date are valid");
        const dateDiff = calculatePeriodsBetweenDates(startDate,processingDate);
        console.log(`Date difference:` + ${dateDiff})
        let monthIncrement = dateDiff.inMonths; 
        // console.log(`Month increment before frequency-based increment: ${monthIncrement}`);
        //if not an aniversary, increment months based on frequency
        console.log(`frequency ${frequency}`);
        switch (frequency) {
            case 1: //monthly
            // console.log(`days diff ${dateDiff.days}`);
            if (dateDiff.days > 0) {
                    monthIncrement +=1;
                    console.log(`Incrementing month increment by 1 month because there are ${dateDiff.days} days since the last billing date`);
                }
                break;
            case 3: //quarterly
                if (dateDiff.months > 0 || dateDiff.days > 0) {
                    monthIncrement= (dateDiff.years * 12) + (dateDiff.quarters*3) +3;
                    console.log(`Incrementing month increment by 3 months because there are ${dateDiff.months} months and ${dateDiff.days} days since the last billing date`);
                }
                break;
            case 12: //yearly
                if (dateDiff.quarters > 0 || dateDiff.months > 0 || dateDiff.days > 0) {
                    monthIncrement= dateDiff.years * 12 +12;
                    console.log(`Incrementing month increment by 12 months because there are ${dateDiff.quarters} quarters, ${dateDiff.months} months, and ${dateDiff.days} days since the last billing date`);
                }
                break;
            default:
                result=`Error: Invalid frequency: ${frequency}`;
                break;
        }
        console.log(`months to increment: ${monthIncrement}`);
        const nextBillingDate = addMonthsToDate(startDate, monthIncrement);
        console.log(`Next billing date`, nextBillingDate);
        result= `Next billing date:, ${nextBillingDate}`;
        return nextBillingDate;
    } else {
        result = `Error: Invalid input. Please provide valid start date, frequency, and processing date`;
    }

    console.log(result);
    addToResultLog(result);

}

function calculatePeriodsBetweenDates(date1, date2) {
    if (date1 === null || date2 === null) {
        throw new Error("calculatePeriodsBetweenDates: null date argument");
    }
    console.log(`Calculating periods between dates: ${formatDate(date1)} and ${formatDate(date2)}`);
    const years = date2.getFullYear() - date1.getFullYear();
    console.log(`Years: ${years}`);
    const quarters = Math.floor((date2.getMonth() - date1.getMonth()) / 3);
    console.log(`Quarters: ${quarters}`);
    const months = (date2.getMonth() - date1.getMonth()) % 12;
    console.log(`Months: ${months}`);
    const days = date2.getDate() - date1.getDate();
    console.log(`Days: ${days}`);
    const inMonths = years*12 + quarters*3 + months;
    console.log(`Total months: ${inMonths}`);
    return { years: years, quarters: quarters, months: months, days: days, inMonths: inMonths };
}


function addMonthsToDate(date, months) {
    console.log(`Adding ${months} months to date`, formatDate(date));
    let newDate = new Date(date.getFullYear(), date.getMonth() + months, 1);
    console.log(`New date`, formatDate(newDate));
    let daysInMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
    console.log(`Days in month`, daysInMonth);
    newDate.setDate(Math.min(date.getDate(), daysInMonth));
    console.log(`Final new date`, formatDate(newDate));
    return formatDate(newDate);
  }


function addToResultLog(result) {
    const resultLog = document.getElementById('resultLog');
    const logEntry = `${result}\n`;
    resultLog.value += logEntry;
    }

function clearResultLog() {
    document.getElementById('resultLog').value = '';
    }

function formatDate(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('en-AU', options);
    }

function testAddMonthsToDate() {
    const testCases = [
        { date: "2023-01-31", months: 1, expected: { date: "28/02/2023"}},
        { date: "2024-01-31", months: 1, expected: { date: "29/02/2024"}},
        { date: "2021-01-31", months: 4, expected: { date: "31/05/2021"}},
        { date: "2024-02-29", months: 5, expected: { date: "29/07/2024" }},
        { date: "2024-02-29", months: 24, expected: { date: "28/02/2026" }},
        { date: "2024-02-29", months: 26, expected: { date: "29/04/2026" }}
        ];
    testCases.forEach((testCase) => {
        try {
            const result = addMonthsToDate(new Date(testCase.date), testCase.months);
            console.log("Testing date:", testCase.date, "months to add:", testCase.months);
            console.log("Expected:", testCase.expected);
            console.log("Actual:", result);
        } catch (error) {
            console.error("Error occurred for test case:", testCase);
            console.error(error);
            throw error;
        }
    });
}
    
function testCalculateNextBillingDate() {
    const testCases = [
        { date1: `2021-01-01`, frequency: 1, date2: `2021-03-01`, expected: { nextBillingDate: "01/03/2021" }},
        { date1: "2024-01-31", frequency: 1, date2: "2025-01-31", expected: { nextBillingDate: "31/01/2025"  }},
        { date1: "2023-01-31", frequency: 12, date2: "2024-01-31", expected: { nextBillingDate: "31/01/2024"  }},
        { date1: "2024-02-29", frequency: 1, date2: "2024-03-31", expected: { nextBillingDate: "29/04/2024"  }},
        { date1: "2024-02-29", frequency: 12, date2: "2025-01-30", expected:  {nextBillingDate: "28/02/2025"  }}
        ];
    let testnbr = 1
    testCases.forEach((testCase) => {
        addToResultLog("testcase" +testnbr + `: Start=${testCase.date1} Frequency=${testCase.frequency} As at=${testCase.date2}`);
        const result = calculateNextBillingDate(new Date(testCase.date1), testCase.frequency, new Date(testCase.date2));     
        addToResultLog("testcase" +testnbr + `: Expected=${testCase.expected.nextBillingDate} Actual=${result}`);
        if (testCase.expected.nextBillingDate === result) {
            addToResultLog("testcase" +testnbr + `: Result= Passed`);
        } else {
            addToResultLog("testcase" +testnbr + `: Result= Failed`);
        }
        console.log("date1:", testCase.date1, "frequency:", testCase.frequency, "Testing date2:", testCase.date2);    
        console.log("Expected:", testCase.expected);
        console.log("Actual:", result);
        testnbr++;
        });
    }

function testCalculatePeriodsBetweenDates() {
    const testCases = [
        { request: { start_date: "2024-01-31",  process_date: "2024-01-31" }, expected: { years: 0, Quarters: 0, Months: 0, Days: 0, inMonths: 0 }},
        { request: { start_date: "2023-01-31",  process_date: "2024-01-31" }, expected: { years: 1, Quarters: 0, Months: 0, Days: 0, inMonths: 12 }},
        { request: { start_date: "2023-02-29",  process_date: "2024-03-31" }, expected: { years: 1, Quarters: 0, Months: 1, Days: 2, inMonths: 13 }},
        { request: { start_date: "2023-02-29",  process_date: "2024-06-30" }, expected: { years: 1, Quarters: 1, Months: 1, Days: 1, inMonths: 16 }}
        ];

        let testnbr = 1
        testCases.forEach((testCase) => {
            try {
                const result = calculatePeriodsBetweenDates(
                    new Date(testCase.request.start_date),
                    new Date(testCase.request.process_date)
                );
                addToResultLog("testcase" +testnbr + `: Request=${testCase.request}`);
                addToResultLog("testcase" +testnbr + `: Expected=${testCase.expected}`);
                addToResultLog("testcase" +testnbr + `: Actual=${result}`);
                if (JSON.stringify(testCase.expected) === JSON.stringify(result)) {
                    addToResultLog("testcase" +testnbr + `: Result= Passed`);   
                } else {
                    addToResultLog("testcase" +testnbr + `: Result= Failed`);
                }
                testnbr++;
            } catch (error) {
                console.error("Error occurred for test case:", testCase);
                console.error(error);
                throw error;
            }
            console.log("Reuest:", testCase.request);    
            console.log("Expected:", testCase.expected);
            console.log("Actual:", result);
        });
    }

