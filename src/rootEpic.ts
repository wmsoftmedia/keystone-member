import { combineEpics } from "redux-observable";

// @ts-ignore
import foodEpic from "./epics/nutritionTrackerEpic";
// @ts-ignore
import trainingTrackerEpic from "./epics/trainingTrackerEpic";
// @ts-ignore
import workoutBuilderEpic from "./epics/workoutBuilderEpic";
// @ts-ignore
import fileSystemEpic from "./epics/fileSystemEpic";

const rootEpic = combineEpics(foodEpic, trainingTrackerEpic, workoutBuilderEpic, fileSystemEpic);

export default rootEpic;
