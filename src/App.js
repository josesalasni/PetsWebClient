import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Dashboard from './Components/Dashboard';


class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Route path="/" component={Dashboard} />
                </div>
               
               
            </BrowserRouter>
          );
    }
}

export default App;