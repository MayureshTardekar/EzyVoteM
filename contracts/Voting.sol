// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    struct Event {
        string title;
        Candidate[] candidates;
        uint256 endTime;
        bool active;
    }

    mapping(uint256 => Event) public events;
    uint256 public eventCount;
    mapping(address => mapping(uint256 => bool)) public hasVoted;

    event EventCreated(uint256 indexed eventId, string title);
    event VoteCast(
        uint256 indexed eventId,
        address indexed voter,
        uint256 candidateIndex
    );

    function createEvent(
        string memory _title,
        string[] memory _candidateNames,
        uint256 _durationInMinutes
    ) public returns (uint256) {
        eventCount++;
        Event storage e = events[eventCount];
        e.title = _title;
        e.endTime = block.timestamp + (_durationInMinutes * 1 minutes);
        e.active = true;

        for (uint i = 0; i < _candidateNames.length; i++) {
            e.candidates.push(
                Candidate({name: _candidateNames[i], voteCount: 0})
            );
        }

        emit EventCreated(eventCount, _title);
        return eventCount;
    }

    function vote(uint256 _eventId, uint256 _candidateIndex) public {
        require(_eventId > 0 && _eventId <= eventCount, "Invalid event ID");
        require(!hasVoted[msg.sender][_eventId], "Already voted");
        require(events[_eventId].active, "Event is not active");
        require(block.timestamp < events[_eventId].endTime, "Event has ended");
        require(
            _candidateIndex < events[_eventId].candidates.length,
            "Invalid candidate"
        );

        events[_eventId].candidates[_candidateIndex].voteCount++;
        hasVoted[msg.sender][_eventId] = true;

        emit VoteCast(_eventId, msg.sender, _candidateIndex);
    }

    function getEvent(
        uint256 _eventId
    )
        public
        view
        returns (
            string memory title,
            Candidate[] memory candidates,
            uint256 endTime,
            bool active
        )
    {
        require(_eventId > 0 && _eventId <= eventCount, "Invalid event ID");
        Event storage e = events[_eventId];
        return (e.title, e.candidates, e.endTime, e.active);
    }
}
