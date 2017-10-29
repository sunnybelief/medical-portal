import dva from 'dva';
import { browserHistory } from 'dva/router';
import { createLogger } from 'redux-logger';
import {notification} from 'antd'
import './index.css';
import createLoading from 'dva-loading';

// 1. Initialize
const app = dva({
  onError(e) {
    notification['error']({
      message: `${e.message}`,
      description: ``,
      duration: 3,
      style:{height:80,paddingBottom:10},
    });

  },
  history: browserHistory,
  // onAction: createLogger(),
});

app.model(require('./models/users'));

app.model(require("./models/html"));

app.model(require("./models/alterOrganization"));

app.model(require("./models/login"));

app.model(require("./models/managerCity"));

app.model(require("./models/managerAppliance"));

app.model(require("./models/addAppliance"));

app.model(require("./models/manager"));

app.model(require("./models/registerMachine"));

app.model(require("./models/registerMonitor"));

app.model(require("./models/main"));

// 2. Plugins
// app.use({});
app.use(createLoading());

// 3. Model
// app.model(require('./models/example'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
