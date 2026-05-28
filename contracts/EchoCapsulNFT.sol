// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {ERC721A} from "erc721a/contracts/ERC721A.sol";

contract EchoCapsulNFT is ERC721A, Ownable, Pausable, ReentrancyGuard {
    using Strings for uint256;

    error MintInactive();
    error SoldOut();
    error InvalidQuantity();
    error MaxPerTxExceeded();
    error MaxPerWalletExceeded();
    error IncorrectPayment();
    error WithdrawFailed();
    error ZeroAddressTreasury();

    uint256 public constant MAX_SUPPLY = 10_000;
    uint256 public mintPrice;
    uint256 public constant MAX_PER_TX = 5;
    uint256 public constant MAX_PER_WALLET = 10;

    bool public mintActive;
    bool public revealed;

    string public prerevealURI;
    string public baseTokenURI;

    address public treasury;

    mapping(address => uint256) public mintedPerWallet;

    event MintStateUpdated(bool active);
    event RevealStateUpdated(bool revealed);
    event BaseURIUpdated(string newBaseURI);
    event PrerevealURIUpdated(string newPrerevealURI);
    event TreasuryUpdated(address indexed newTreasury);
    event MintPriceUpdated(uint256 newMintPrice);
    event FundsWithdrawn(address indexed treasury, uint256 amount);

    constructor(
        address initialOwner,
        address initialTreasury,
        string memory initialPrerevealURI
    ) ERC721A("EchoCapsul", "ECP") {
        if (initialTreasury == address(0)) revert ZeroAddressTreasury();
        treasury = initialTreasury;
        prerevealURI = initialPrerevealURI;
        transferOwnership(initialOwner);
    }

    function mint(uint256 quantity) external payable nonReentrant whenNotPaused {
        if (!mintActive) revert MintInactive();
        if (quantity == 0) revert InvalidQuantity();
        if (quantity > MAX_PER_TX) revert MaxPerTxExceeded();
        if (totalSupply() + quantity > MAX_SUPPLY) revert SoldOut();
        if (mintedPerWallet[msg.sender] + quantity > MAX_PER_WALLET) revert MaxPerWalletExceeded();
        if (msg.value != quantity * mintPrice) revert IncorrectPayment();

        mintedPerWallet[msg.sender] += quantity;
        _safeMint(msg.sender, quantity);
    }

    function setMintActive(bool active) external onlyOwner {
        mintActive = active;
        emit MintStateUpdated(active);
    }

    function setRevealed(bool state) external onlyOwner {
        revealed = state;
        emit RevealStateUpdated(state);
    }

    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    function setPrerevealURI(string calldata newPrerevealURI) external onlyOwner {
        prerevealURI = newPrerevealURI;
        emit PrerevealURIUpdated(newPrerevealURI);
    }

    function setTreasury(address newTreasury) external onlyOwner {
        if (newTreasury == address(0)) revert ZeroAddressTreasury();
        treasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }

    function setMintPrice(uint256 newMintPrice) external onlyOwner {
        mintPrice = newMintPrice;
        emit MintPriceUpdated(newMintPrice);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function withdraw() external onlyOwner nonReentrant {
        uint256 amount = address(this).balance;
        (bool success,) = payable(treasury).call{value: amount}("");
        if (!success) revert WithdrawFailed();
        emit FundsWithdrawn(treasury, amount);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (!_exists(tokenId)) revert URIQueryForNonexistentToken();

        if (!revealed) {
            return prerevealURI;
        }

        return string(abi.encodePacked(baseTokenURI, tokenId.toString(), ".json"));
    }
}
