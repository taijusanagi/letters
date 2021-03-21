// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./extentions/IHasSecondarySaleFees.sol";
import "./libraries/IPFS.sol";
import "./libraries/LiteralStrings.sol";
import "./libraries/TrimStrings.sol";

contract Letters is ERC721, IHasSecondarySaleFees {
    using LiteralStrings for bytes;
    using TrimStrings for bytes32;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdTracker;

    mapping(uint256 => bytes32) public letterMemory;
    mapping(uint256 => address payable[]) public fromMemory;
    mapping(bytes32 => bool) public letterHasBeenSent;

    mapping(address => bool) public receiveBoxClosed;

    uint256 public constant lastTokenId = 16384;
    uint256[] public feeBps = [1000];

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    function _beforeTokenTransfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal virtual override {
        super._beforeTokenTransfer(_from, _to, _tokenId);
        require(!receiveBoxClosed[_to], "receive box closed");
    }

    function closeReceiveBox() public {
        require(!receiveBoxClosed[msg.sender], "already closed");
        receiveBoxClosed[msg.sender] = true;
    }

    function openReceiveBox() public {
        require(receiveBoxClosed[msg.sender], "already opened");
        receiveBoxClosed[msg.sender] = false;
    }

    function sendLetter(address _to, bytes32 _letter) public {
        bytes32 digest = keccak256(abi.encodePacked(msg.sender, _letter));
        require(!letterHasBeenSent[digest], "letter has been sent");
        uint256 tokenId = _tokenIdTracker.current();
        require(tokenId <= lastTokenId, "all letters have been sent");
        letterMemory[tokenId] = _letter;
        fromMemory[tokenId].push(payable(msg.sender));
        letterHasBeenSent[digest] = true;
        _mint(_to, tokenId);
        _tokenIdTracker.increment();
    }

    function getFeeBps(uint256 _tokenId) external view override returns (uint256[] memory) {
        require(_exists(_tokenId), "query for nonexistent token");
        return feeBps;
    }

    function getFeeRecipients(uint256 _tokenId) external view override returns (address payable[] memory) {
        require(_exists(_tokenId), "query for nonexistent token");
        return fromMemory[_tokenId];
    }

    function getName(uint256 _tokenId) public view returns (string memory) {
        require(_exists(_tokenId), "query for nonexistent token");
        return letterMemory[_tokenId].toString();
    }

    function getDescription(uint256 _tokenId) public view returns (string memory) {
        require(_exists(_tokenId), "query for nonexistent token");
        return string(abi.encodePacked("32bytes from ", abi.encodePacked(fromMemory[_tokenId][0]).toLiteralString()));
    }

    function getImageData(uint256 _tokenId) public view returns (string memory) {
        require(_exists(_tokenId), "query for nonexistent token");
        return "image";
    }

    function getMetaData(uint256 _tokenId) public view returns (string memory) {
        require(_exists(_tokenId), "query for nonexistent token");
        return
            string(
                abi.encodePacked(
                    '{"name":"',
                    getName(_tokenId),
                    '","description":"',
                    getDescription(_tokenId),
                    '","image_data":"',
                    getImageData(_tokenId),
                    '"}'
                )
            );
    }
}
