export interface Candidate {
  name: string;
  bio: string;
  votes: number;
}

export interface Event {
  _id: string;
  eventId: string;
  title: string;
  candidates: Candidate[];
  active: boolean;
  startDate: string;
  endDate: string;
}