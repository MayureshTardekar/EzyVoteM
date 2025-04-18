import { ethers } from 'ethers';
import Voting from '../abi/Voting.json';

export const VotingABI = Voting.abi;

export const getVotingContract = (provider: ethers.providers.Provider) => {
  return new ethers.Contract(
    import.meta.env.VITE_VOTING_CONTRACT_ADDRESS,
    VotingABI,
    provider
  );
};
