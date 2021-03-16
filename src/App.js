import logo from './logo.svg';
import './App.css';
import { Router, Switch, Route, Redirect } from 'module/router/index';

import { Provider } from 'react-redux';
import store from 'redux/config/store';
import Editor from 'module/screens/Editor';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { palette } from 'styles/pallete';

const theme = createMuiTheme({
    palette: palette,
});

function App() {
    return (
        <Provider store={store}>
            {/* <div> Hello</div> */}
            <Router>
                <Switch>
                    <ThemeProvider theme={theme}>
                        <Route path="/" exact component={Editor} />
                    </ThemeProvider>
                </Switch>
            </Router>
        </Provider>
    );
}

export default App;
