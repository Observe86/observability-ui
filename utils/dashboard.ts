import { format, isSameDay, parseISO, subDays } from "date-fns";

import { TimeSeriesPoint } from "@/types/TimeSeriesPoint";

/**
 * Converts a list of time series data points into a consistent daily chart data array,
 * padding missing days with zero values.
 *
 * This is useful for our charting library to ensure that charts always
 * display a fixed number of days (default: 30), even if no data exists for some days.
 *
 * @param data - An optional array of time series points where each point contains a period (date string)
 *               and a count (numeric value).
 * @param days - The number of past days (including today) to generate data for.
 *               Defaults to 30. For example, days = 7 returns data for the past 7 days.
 * @returns An array of objects with date and value fields, where each date is a string
 *          in yyyy-MM-dd format and value is the corresponding count or 0 if not found in the input data.
 */
export const toChartData = (data?: Array<TimeSeriesPoint>, days = 30) => {
  const today = new Date();
  const result = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, "yyyy-MM-dd");

    const matching = data?.find((d) => isSameDay(parseISO(d.period), date));

    result.push({
      date: dateStr,
      value: matching?.count ?? 0,
    });
  }

  return result;
};
