import logo from './logo.svg';
import './App.css';
import { Router, Switch, Route, Redirect } from 'module/router/index';

import { Provider } from 'react-redux';
import store from 'redux/config/store';
import Editor from 'module/screens/Editor';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { palette } from 'styles/pallete';
import Login from 'module/screens/Login';
import RegisterScreen from 'module/screens/Register';
import { tokenHelper } from 'services/tokenHelpers';
import EditorWrapper from 'module/screens/EditorWrapper';

const theme = createMuiTheme({
    palette: palette,
});

function App() {
    let loggedIn = tokenHelper.auth();

    return (
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                {/* <div> Hello</div> */}
                <Router style={{ flex: 1 }}>
                    <Switch>
                        <Route exact path="/">
                            {!loggedIn ? <Redirect to="/login" /> : <Redirect to="/sparql" />}
                        </Route>

                        <Route path="/sparql" exact component={EditorWrapper} />
                        <Route path="/login" exact component={Login} />
                        <Route path="/register" exact component={RegisterScreen} />
                    </Switch>
                </Router>
            </Provider>
        </ThemeProvider>
    );
}

export default App;
