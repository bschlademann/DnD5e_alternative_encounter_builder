// stringify data

export type State = {
  name: string;
  cr: number;
}[];

// localStorage: bennis_app_lastUpdatedAt, bennis_app_data
declare function getLastUpdatedAt(): Date | undefined;
declare function setLastUpdatedAt(date: Date): void;
declare function saveState(state: State): void;
declare function loadState(): State;
