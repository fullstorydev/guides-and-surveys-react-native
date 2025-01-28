"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useCurrentRouteName = void 0;
var _native = require("@react-navigation/native");
var _react = require("react");
const useCurrentRouteName = () => {
  const [currentRouteName, setCurrentRouteName] = (0, _react.useState)('');
  const state = (0, _native.useNavigationState)(s => s);
  (0, _react.useEffect)(() => {
    if (state) {
      let route = state.routes[state.index];
      const pathResult = [];
      if (route) {
        pathResult.push(route.name);
        let subState = route.state;
        while (subState) {
          route = subState.routes[subState.index ?? 0];
          if (route) {
            pathResult.push(route.name);
            subState = route.state;
          } else {
            subState = undefined;
          }
        }
      }
      setCurrentRouteName(pathResult.join('/'));
    }
  }, [state]);
  return currentRouteName;
};
exports.useCurrentRouteName = useCurrentRouteName;
//# sourceMappingURL=useCurrentRouteName.js.map