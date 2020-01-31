import GoTrue from "gotrue-js";

export const auth = new GoTrue({
    APIUrl: "https://arielfeminisms.netlify.com/.netlify/identity",
    setCookie: true
});