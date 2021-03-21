// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./extentions/IHasSecondarySaleFees.sol";
import "./libraries/Bytes32.sol";
import "./libraries/IPFS.sol";
import "./libraries/LiteralStrings.sol";
import "./libraries/TrimStrings.sol";

import "hardhat/console.sol";

contract Letters is ERC721, IHasSecondarySaleFees {
    using LiteralStrings for bytes;
    using Bytes32 for string;
    using IPFS for bytes;
    using IPFS for bytes32;
    using TrimStrings for bytes32;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdTracker;

    mapping(uint256 => bytes32) public letterMemory;
    mapping(uint256 => address payable) public fromMemory;
    mapping(bytes32 => bool) public letterHasBeenSent;

    mapping(address => bool) public receiveBoxClosed;

    uint256 public supplyLimit;
    uint256[] public feeBps;

    constructor(
        string memory _name,
        string memory _symbol,
        address _owner,
        uint256 _supplyLimit,
        uint256[] memory _feeBps
    ) ERC721(_name, _symbol) {
        require(bytes(_name).length < 32, "name too long");
        supplyLimit = _supplyLimit;
        feeBps = _feeBps;
        sendLetter(_owner, _name.toBytes32());
    }

    function LETTERS_PROVENANCE() public view returns (bytes32) {
        uint256 currentSupply = _tokenIdTracker.current();
        require(currentSupply > supplyLimit, "provenance not determined");
        bytes32 concatenated = getProvenance(0);
        for (uint256 i = 1; i <= supplyLimit; i++) {
            concatenated = sha256(abi.encodePacked(concatenated, getProvenance(i)));
        }
        return concatenated;
    }

    function owner() public view virtual returns (address) {
        return ownerOf(0);
    }

    function sendLetter(address _to, bytes32 _letter) public {
        uint256 tokenId = _tokenIdTracker.current();
        require(tokenId <= supplyLimit, "all letters have been sent");
        require(!letterHasBeenSent[_letter], "letter has been sent");
        require(_to != msg.sender, "letter cannot sent to yourself");
        letterHasBeenSent[_letter] = true;
        letterMemory[tokenId] = _letter;
        fromMemory[tokenId] = payable(msg.sender);
        _mint(_to, tokenId);
        _tokenIdTracker.increment();
    }

    function getFeeBps(uint256 _tokenId) external view override returns (uint256[] memory) {
        require(_exists(_tokenId), "query for nonexistent token");
        return feeBps;
    }

    function getFeeRecipients(uint256 _tokenId) external view override returns (address payable[] memory) {
        require(_exists(_tokenId), "query for nonexistent token");
        address payable[] memory feeRecipients = new address payable[](2);
        feeRecipients[0] = payable(owner());
        feeRecipients[1] = payable(fromMemory[_tokenId]);
        return feeRecipients;
    }

    function getName(uint256 _tokenId) public view returns (string memory) {
        require(_exists(_tokenId), "query for nonexistent token");
        return letterMemory[_tokenId].toString();
    }

    function getDescription(uint256 _tokenId) public view returns (string memory) {
        require(_exists(_tokenId), "query for nonexistent token");
        return string(abi.encodePacked("32bytes from ", abi.encodePacked(fromMemory[_tokenId]).toLiteralString()));
    }

    function getImageData(uint256 _tokenId) public view returns (string memory) {
        require(_exists(_tokenId), "query for nonexistent token");
        return
            '<svg width=\\"350\\" height=\\"350\\" xmlns=\\"http://www.w3.org/2000/svg\\"><text x=\\"175\\" y=\\"175\\" text-anchor=\\"middle\\" font-family=\\"sans-serif\\" font-size=\\"20\\">Hi.</text></svg>';
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

    function getProvenance(uint256 _tokenId) public view returns (bytes32) {
        require(_exists(_tokenId), "query for nonexistent token");
        return sha256(abi.encodePacked(getMetaData(_tokenId)));
    }

    function getCid(uint256 _tokenId) public view returns (string memory) {
        require(_exists(_tokenId), "query for nonexistent token");
        return string(abi.encodePacked(getMetaData(_tokenId)).toIpfsDigest().addSha256FunctionCodePrefix().toBase58());
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        require(_exists(_tokenId), "query for nonexistent token");
        return string(abi.encodePacked(getCid(_tokenId)).addIpfsBaseUrlPrefix());
    }
}
