import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Layout from "./Layout";

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Layout />
        </div>
      </BrowserRouter>
    );
  }
}

if (document.getElementById("app")) {
  ReactDOM.render(<App />, document.getElementById("app"));
}
