import * as React from "react";
import * as ReactDOM from "react-dom";

import { WarningWindowComponent } from "./components/warning-window";

document.onreadystatechange = () => {
  if (document.readyState === "complete") {

    let container: HTMLElement = document.createElement("div");
    container.id = "classicContainer";
    document.getElementById("suiteBarDelta").appendChild(container);

    ReactDOM.render(
      React.createElement(WarningWindowComponent, {
        // tslint:disable-next-line:no-string-literal
        isAdmin: window["_spPageContextInfo"].isSiteAdmin
      }),
      document.getElementById("classicContainer")
    );
  }
};
