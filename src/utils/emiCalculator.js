/* ----------------------------------------------
   PARSE dd/MM/yyyy STRICT
---------------------------------------------- */
export function parseDdMmYyyy(dateStr) {
  if (!dateStr) return null;

  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateStr.match(regex);
  if (!match) return null;

  const dd = parseInt(match[1], 10);
  const mm = parseInt(match[2], 10);
  const yyyy = parseInt(match[3], 10);

  const d = new Date(yyyy, mm - 1, dd);
  if (
    d.getDate() !== dd ||
    d.getMonth() + 1 !== mm ||
    d.getFullYear() !== yyyy
  )
    return null;

  return d;
}

/* ----------------------------------------------
   EXACT EMI CALCULATION → proper round-split
---------------------------------------------- */
export function calculateEMI(totalDue, months) {
  const total = Math.round(totalDue);
  const base = Math.floor(total / months);
  const remainder = total - base * months;

  const amounts = new Array(months).fill(base);
  if (remainder > 0) {
    amounts[months - 1] = base + remainder;
  }
  return {
    monthlyBase: base,
    amounts,
    totalPayable: total
  };
}

/* ----------------------------------------------
   FORMATTER
---------------------------------------------- */
function formatDisplay(d) {
  const dd = String(d.getDate()).padStart(2, "0");
  const m = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];
  return `${dd} ${m[d.getMonth()]} ${d.getFullYear()}`;
}

/* ----------------------------------------------
   MONTH DIFFERENCE FOR EMI:
   EMI starts NEXT MONTH
   EMI must end BEFORE due-date month

   Example:
   today = 25 Jan 2025
   due = 05 Mar 2025
   EMI window = Feb only → 1 month possible
---------------------------------------------- */
export function getMonthDifference(fromDate, dueDateStr) {
  const dueDate = parseDdMmYyyy(dueDateStr);
  if (!dueDate) return 0;

  const start = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 1); // next month
  const end = new Date(dueDate.getFullYear(), dueDate.getMonth() - 1, 1); // month before due date

  let months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth()) +
    1;

  if (months < 0) months = 0;
  return months;
}

/* ----------------------------------------------
   GENERATE EMI SCHEDULE
   Rules:
   - Start from NEXT MONTH of today
   - Payment day = preferredDay (1–28)
   - Last payment must be BEFORE due-date month
   - Amounts[] passed from exact EMI calculation
---------------------------------------------- */
export function generateSchedule(
  dueDateStr,
  months,
  amounts,         // array of EMI amounts
  preferredDay = 5,
  conversionDate = new Date()
) {
  const dueDate = parseDdMmYyyy(dueDateStr);
  if (!dueDate) return { ok: false, error: "Invalid due date." };

  if (!Array.isArray(amounts) || amounts.length !== months)
    return { ok: false, error: "Invalid EMI amounts." };

  let day = preferredDay;
  if (isNaN(day) || day < 1 || day > 28) day = 5;

  // START DATE = next month from today
  const start = new Date(
    conversionDate.getFullYear(),
    conversionDate.getMonth() + 1,
    day
  );

  // LAST ALLOWED MONTH = month before due date
  const lastAllowed = new Date(
    dueDate.getFullYear(),
    dueDate.getMonth() - 1,
    day
  );

  if (start > lastAllowed) {
    return {
      ok: false,
      error: "EMI cannot fit between now and the due date.",
    };
  }

  // Build schedule
  const schedule = [];

  for (let i = 0; i < months; i++) {
    const d = new Date(start.getFullYear(), start.getMonth() + i, day);

    if (d > lastAllowed) {
      return {
        ok: false,
        error:
          "Too many installments. EMI cannot go beyond the month before due-date.",
      };
    }

    schedule.push({
        date: d,
        display: formatDisplay(d),
        amount: amounts[i], // integer EMI
        iso: d.toISOString().slice(0, 10),
    });
  }

  return {
    ok: true,
    schedule,
    start: schedule[0]?.display,
    end: schedule[schedule.length - 1]?.display,
  };
}

/* ----------------------------------------------
   SUGGEST TENURES
---------------------------------------------- */
export function suggestTenures(dueAmount, candidates = [3, 6, 9, 12]) {
  const list = candidates.map((m) => {
    const { monthlyBase } = calculateEMI(dueAmount, m);
    return { months: m, monthly: monthlyBase };
  });

  const sorted = [...list].sort((a, b) => a.monthly - b.monthly);
  const recommended = new Set(sorted.slice(0, 2).map((x) => x.months));

  return list.map((x) => ({
    ...x,
    recommended: recommended.has(x.months),
  }));
}
