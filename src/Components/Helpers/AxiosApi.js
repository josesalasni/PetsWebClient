import { create } from 'axios';

//Set Base Url for api calls


var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjYXJsb3MxOTk3eXlAZ21haWwuY29tIiwianRpIjoiNDZiOTBhYzQtMTUxNi00ZjE1LTljMDQtYTNlMDYzMWJjMjk4IiwiaWF0IjoxNTU2MDkyMzI5LCJpZCI6IjU3MjBkYmIzLTEwZDctNDI4OC05MGE4LTQ2N2I5MDkwODBlZCIsIm5iZiI6MTU1NjA5MjMyOSwiZXhwIjoxNTY2NDYwMzI5LCJpc3MiOiJUb2RvcGkiLCJhdWQiOiJodHRwOi8vMTI3LjAuMC4xOjUwMDAvIn0._7C8a5iPAB0tqlaZwgIG1lDLFouNlEOsy1gTm2I8WR4";


var AxiosApi = create({
    baseURL: 'http://127.0.0.1:5000/', 
    headers : {
        "Content-Type": "application/json",
        "Accept" : "application/json",
        "Authorization": 'Bearer ' + token
    }
});

export default AxiosApi;