import GoTrue from "gotrue-js";
import { format, getYear, formatDistanceToNow } from "date-fns";


export const auth = new GoTrue({
    APIUrl: "https://arielfeminisms.netlify.app/.netlify/identity",
    setCookie: true
});

export const formattedDate = (start, end) => {

    const startDate = Date.parse(start);

    if (!end) {
        return format(startDate, "dd.MM.yyyy");
    }

    const endDate = Date.parse(end);

    if (format(startDate, "dd.MM.yyyy") == format(endDate, "dd.MM.yyyy")) {
        return format(startDate, "dd.MM.yyyy");
    }

    const startFormat =
        getYear(startDate) == getYear(endDate) ? "dd.MM" : "dd.MM.yyyy";
    const endFormat = "dd.MM.yyyy";

    return format(startDate, startFormat) + " – " + format(endDate, endFormat);
};

export const formattedDuration = date =>
    formatDistanceToNow(Date.parse(date), { addSuffix: true });