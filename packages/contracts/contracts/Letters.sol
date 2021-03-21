// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./extentions/IHasSecondarySaleFees.sol";
import "./libraries/IPFS.sol";
import "./libraries/LiteralStrings.sol";

contract Letters is ERC721, IHasSecondarySaleFees {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdTracker;

    mapping(uint256 => bytes32) public letterMemory;
    mapping(uint256 => address payable[]) public fromMemory;
    mapping(bytes32 => bool) public letterHasBeenSent;

    uint256[] public feeBps;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256[] memory _feeBps
    ) ERC721(_name, _symbol) {
        // just make sure feeBp is [1000] = 10% for sender
        require(feeBps.length == 1, "feeBps length invalid");
        require(feeBps[0] == 1000, "feeBp #1 invalid");
        feeBps = _feeBps;
    }

    function sendLetter(address _to, bytes32 _letter) public {
        bytes32 digest = keccak256(abi.encodePacked(msg.sender, _letter));
        require(!letterHasBeenSent[digest], "letter has been sent");
        _tokenIdTracker.increment();
        uint256 tokenId = _tokenIdTracker.current();
        letterMemory[tokenId] = _letter;
        fromMemory[tokenId].push(payable(msg.sender));
        letterHasBeenSent[digest] = true;
        _mint(_to, tokenId);
    }

    function getFeeBps(uint256 _tokenId) external view override returns (uint256[] memory) {
        require(_exists(_tokenId), "query for nonexistent token");
        return feeBps;
    }

    function getFeeRecipients(uint256 _tokenId) external view override returns (address payable[] memory) {
        require(_exists(_tokenId), "query for nonexistent token");
        return fromMemory[_tokenId];
    }
}
