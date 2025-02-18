"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useTargetting = void 0;
var _react = require("react");
var _useStore = require("../stores/useStore.js");
var _useCurrentRouteName = require("./useCurrentRouteName.js");
const useTargetting = () => {
  const currentRouteName = (0, _useCurrentRouteName.useCurrentRouteName)();
  const tours = (0, _useStore.useStore)(s => s.tours);
  const setTourStepIndex = (0, _useStore.useStore)(s => s.setTourStepIndex);
  const setAvailableTour = (0, _useStore.useStore)(s => s.setAvailableTour);
  const progressorData = (0, _useStore.useStore)(s => s.progressorData);
  (0, _react.useEffect)(() => {
    if (tours && tours.length) {
      const avTour = tours.find(tour => {
        if (tour.targets) {
          const conditions = tour.targets.map(target => checkByTargets({
            target,
            path: currentRouteName,
            autoSegment: progressorData?.autoSegment,
            customSegments: progressorData?.customSegments
          }));
          if (tour.targetOperator === 0) {
            return conditions.every(c => c);
          } else {
            return conditions.some(c => c);
          }
        }
        return undefined;
      });
      const currentStep = progressorData?.tours?.find(t => t.id.toString() === avTour?.id.toString())?.currentStep ?? 0;
      setAvailableTour(avTour, currentStep);
    } else {
      setAvailableTour(undefined);
    }
  }, [currentRouteName, progressorData, setAvailableTour, setTourStepIndex, tours]);
};
exports.useTargetting = useTargetting;
const checkByTargets = ({
  target,
  path,
  autoSegment,
  customSegments
}) => {
  switch (target.type) {
    case 'user-segment':
      return target.formattedName && (customSegments?.includes(target.formattedName) || autoSegment === target.formattedName);
    case 'address-simple':
    default:
      return !!target.url && path?.includes(target.url);
  }
};
//# sourceMappingURL=useTargetting.js.map