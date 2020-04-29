import React from "react";
import ReactDOM from "react-dom";
import {useRoutes, A} from "hookrouter";

import App from "./components/app";
import MemeForm from "./components/memeForm";
import "./style/main.scss";

const routes = {
  "/": () => <App />,
  // CURRYING
  // "/": () => (someArg) => <App loggedIn={someArg} />
  "/form": () => <MemeForm />,
  "/for/:id": ({ id }) => <MemeForm id={id} editMode={true} />
};


function Main() {
  // const [loggedInStatus, setLoggin] = useState('NOT_LOGGED_IN')
  return (
    <div>
      <div className="navbar">
        <A href="/">HOME</A>
        <A href="/form">FORM</A>
      </div>
      {useRoutes(routes)}
       {/* CURRYING */}
      {/* {useRoutes(routes)(loggedIn)} */}
    </div>
  )

}


ReactDOM.render(<Main />, document.querySelector(".app-wrapper"));
