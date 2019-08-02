
import * as React from 'react';
import MenuBar from './MenuBar';
import {PhoneBookListPage} from '../../phonebooklist';
import {Route} from 'react-router-dom';
import {PhoneBookListPagePath, HomePagePath} from './RoutePaths';
import Home from './Home';
import {RouteComponentProps, Switch} from 'react-router';

const NoMatch = () => (
  <h1 style={{color:'red'}}>Page not found!</h1>
);

export class App extends React.Component<object, object> {
  public render(): React.ReactElement<App> {

    return (
        <div>
          <MenuBar title='PhoneBook App Test'/>
          <Switch>
            <Route exact path={HomePagePath} component={Home} />
            <Route exact path={PhoneBookListPagePath} component={PhoneBookListPage} />
            <Route component={NoMatch}/>
          </Switch>
        </div>
    );
  }
}

export default App;
