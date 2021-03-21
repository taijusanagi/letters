import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { AtomsRootLoader } from "./components/utils/hooks";
import Home from "./pages/index";

const App: React.FC = () => {
  return (
    <div className="font-body">
      <RecoilRoot>
        <AtomsRootLoader>
          <Router>
            <Switch>
              <Route path="/" exact>
                <Home />
              </Route>
            </Switch>
          </Router>
        </AtomsRootLoader>
      </RecoilRoot>
    </div>
  );
};

export default App;
