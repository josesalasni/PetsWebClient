import React, { Component } from 'react';
import { BrowserRouter, Route} from "react-router-dom";
import Dashboard from './Components/Dashboard';
import LoginScreen from './Components/LoginScreen';


class App extends Component {
    render() {
        return (
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <div>
                    <Route exact path={"/"} component={LoginScreen} />
                    <Route path={"/user"} component={Dashboard} />
                </div>
               
               
            </BrowserRouter>
          );
    }
}

export default App;