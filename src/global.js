import GoTrue from "gotrue-js";
import { format, getYear } from "date-fns";


export const auth = new GoTrue({
    APIUrl: "https://arielfeminisms.netlify.com/.netlify/identity",
    setCookie: true
});

export const formattedDate = (start, end) => {
    const startDate = Date.parse(start);
    const endDate = Date.parse(end);

    const startFormat =
        getYear(startDate) == getYear(endDate) ? "dd.MM" : "dd.MM.yyyy";
    const endFormat = "dd.MM.yyyy";

    return format(startDate, startFormat) + " – " + format(endDate, endFormat);
};