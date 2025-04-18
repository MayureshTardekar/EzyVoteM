import { FC } from "react";
import { Candidate } from "../types";

interface CandidateListProps {
  candidates: Candidate[];
}

const CandidateList: FC<CandidateListProps> = ({ candidates }) => {
  return (
    <div>
      {candidates.map((candidate, index) => (
        <div key={index}>
          {candidate.name}: {candidate.votes} votes
        </div>
      ))}
    </div>
  );
};

export default CandidateList;
