import React, { Component } from 'react';
import { Link, NavLink, Route } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import axios from 'axios';

const url = 'http://penguin.linux.test:4000/api/projects';

// STYLES
const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #111;
    color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1 {
    color: #e8e;
    text-transform: uppercase;
    padding-bottom: 5px;
    border-bottom: 1px solid;
    display: inline-block;
    margin-bottom: .25em;
  }

  a {
    color: #ebe;
    cursor: pointer;
  }

  details {
    margin-left: 30px;
    margin-bottom: 15px;
  }

  summary {
    outline: none;
    margin-bottom: 5px;
  }
`;

const AppContainer = styled.div`
  padding: 15px;
`;

const LinkList = styled.ul`
  a.active {
    color: red;
  }
`;

// COMPONENTS
class App extends Component {
  state = { projects: [] }

  async componentDidMount() {
    try {
      const { data } = await axios.get(url);
      this.setState({ projects: data });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { projects } = this.state;
    const { location } = this.props;
    return (
      <React.Fragment>
        <GlobalStyles />
        <AppContainer>
          <h1>Web API</h1>
          <h5>Welcome... Please continue by clicking the link below. It will show you list of projects.</h5>
          {location.pathname === '/' ? (
            <Link to="/api/projects">Display Projects</Link>
          ) : (
              <Link to="/">Hide Projects</Link>
            )}
          <Route path="/api/projects" render={props => (
            <React.Fragment>
              <h3>Projects</h3>
              <LinkList>
                {projects.map(project => (
                  <li key={project.id}>
                    <NavLink to={`${props.match.url}/${project.id}`}>{project.name}</NavLink>
                    <p>{project.description}</p>
                  </li>
                ))}
              </LinkList>
            </React.Fragment>
          )} />
          <Route path="/api/projects/:id" component={Actions} />
        </AppContainer>
      </React.Fragment>
    );
  }
}

class Actions extends Component {
  state = { actions: [] }

  componentDidMount() {
    this.fetchActions();
  }

  componentDidUpdate(prevProps) {
    const prevID = prevProps.match.params.id;
    const newID = this.props.match.params.id;
    if (newID !== prevID) this.fetchActions();
  }

  fetchActions = async () => {
    const { data: { actions } } = await axios.get(`${url}/${this.props.match.params.id}`);
    this.setState({ actions });
  }

  render() {
    const { actions } = this.state;
    return (
      <div>
        {actions.length ? (
          <React.Fragment>
            <h3>Actions</h3>
            {actions.map(action => (
              <details key={action.id}>
                <summary>{action.description}</summary>
                {action.notes}
              </details>
            ))}
          </React.Fragment>
        ) : (
            <p>Loading...</p>
          )}
      </div>
    );
  }
}

export default App;
