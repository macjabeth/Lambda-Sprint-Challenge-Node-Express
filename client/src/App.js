import React, { Component } from 'react';
import { Link, NavLink, Route } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import axios from 'axios';

const url = 'http://penguin.linux.test:4000/api/projects';

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
      <div className="app">
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
            <ul>
              {projects.map(project => (
                <li key={project.id}>
                  <NavLink to={`${props.match.url}/${project.id}`}>{project.name}</NavLink>
                  <p>{project.description}</p>
                </li>
              ))}
            </ul>
          </React.Fragment>
        )} />
        <Route path="/api/projects/:id" component={Actions} />
      </div>
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
