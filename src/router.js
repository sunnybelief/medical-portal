import React from 'react';
import { IndexRoute,Router, Route } from 'dva/router';
import Users from './routes/Users.js';
import Main from "./routes/Main.js";

import RegisterMonitor from "./routes/RegisterMonitor.js";

import RegisterMachine from "./routes/RegisterMachine.js";

import Manager from "./routes/Manager.js";

import AddAppliance from "./routes/AddAppliance.js";

import ManagerAppliance from "./routes/ManagerAppliance.js";
import HtmlComponent from "./components/html/HtmlComponent";
import ManagerCityMonitorComponent from "./components/unitManager/ManagerCityMonitorComponent";

import Login from "./routes/Login.js";

import AlterOrganizationDetail from "./routes/AlterOrganizationDetail.js";

function RouterConfig({ history }) {
  return (
    <div>
      <Router history={history}>
        <Route path="/" component={Main}>
          <IndexRoute component={Users} />
          <Route path="/users" component={Users} />
          <Route path="/RegisterMonitor" component={RegisterMonitor} />
          <Route path="/RegisterMachine" component={RegisterMachine} />
          <Route path="/Manager" component={Manager} />
          <Route path="/ManagerCityMonitor" component={ManagerCityMonitorComponent} />
          <Route path="/AddAppliance" component={AddAppliance} />
          <Route path="/ManagerAppliance" component={ManagerAppliance} />
          <Route path="/AlterOrganizationDetail" component={AlterOrganizationDetail} />
          <Route path="/html" component={HtmlComponent} />
        </Route>
        <Route path="/login" component={Login} />
      </Router>
    </div>
  );
}

export default RouterConfig;
