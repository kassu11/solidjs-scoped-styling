/* @refresh reload */
import { render } from 'solid-js/web'
import App from './App.scoped.jsx'
import { Card } from './Card.scoped.jsx'
import { Route, Router } from '@solidjs/router';

const root = document.getElementById('root')

render(() => (
  <Router root={App} base="/">
    <Route path="/test" component={Card} />
  </Router>
), root);
