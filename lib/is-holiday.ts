import moment from "moment";

const isHoliday = (dateValue: string) => {
  const dayValue: moment.Moment = moment(dateValue).subtract(1, "days");
  const day = new Date(dayValue.toDate());
  const dayNumber = day.getDay();
  
  if (dayNumber !== 0 && dayNumber !== 6) {
    //   alert(dayValue)
    return dayValue;
  } else if (dayNumber === 0) {
    // Sunday
    const newDate: moment.Moment = moment(day).subtract(2, "days")
    return newDate;
  } else {
    // Saturday
    const newDate: moment.Moment = moment(day).subtract(1, "days")
    return newDate;
  }
};
export default isHoliday;
