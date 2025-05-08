
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./NFTDrop.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

/**
 * @title NFTLaunchpadFactory
 * @dev Factory contract for creating NFT drops
 */
contract NFTLaunchpadFactory is Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;
    
    // Platform fee
    uint256 public platformFee = 0.01 ether;
    address public feeRecipient;
    
    // Mapping of creator address to their drops
    mapping(address => EnumerableSet.AddressSet) private creatorDrops;
    
    // All drops created through the factory
    EnumerableSet.AddressSet private allDrops;
    
    // Events
    event DropCreated(address indexed creator, address dropAddress, string name);
    event PlatformFeeUpdated(uint256 newFee);
    event FeeRecipientUpdated(address newRecipient);
    
    /**
     * @dev Constructor
     * @param _feeRecipient Address to receive platform fees
     */
    constructor(address _feeRecipient) Ownable(msg.sender) {
        feeRecipient = _feeRecipient;
    }
    
    /**
     * @dev Create a new NFT drop
     * @param _name Collection name
     * @param _symbol Collection symbol
     * @param _maxSupply Maximum token supply
     * @param _mintPrice Price per mint in wei
     * @param _isSoulbound Whether tokens are soulbound (non-transferable)
     * @param _canBurn Whether tokens can be burned
     * @param _baseTokenURI Base URI for token metadata
     * @param _logoURI URI for collection logo
     * @param _bannerURI URI for collection banner
     * @return Address of the new drop contract
     */
    function createDrop(
        string memory _name,
        string memory _symbol,
        uint256 _maxSupply,
        uint256 _mintPrice,
        bool _isSoulbound,
        bool _canBurn,
        string memory _baseTokenURI,
        string memory _logoURI,
        string memory _bannerURI
    ) external payable returns (address) {
        // Check if platform fee is paid
        require(msg.value >= platformFee, "Insufficient platform fee");
        
        // Deploy new NFTDrop contract
        NFTDrop newDrop = new NFTDrop(
            _name,
            _symbol,
            _maxSupply,
            _mintPrice,
            _isSoulbound,
            _canBurn,
            _baseTokenURI,
            _logoURI,
            _bannerURI,
            msg.sender  // Creator is msg.sender
        );
        
        // Add drop to creator's drops and all drops
        creatorDrops[msg.sender].add(address(newDrop));
        allDrops.add(address(newDrop));
        
        // Forward platform fee to fee recipient
        (bool success, ) = feeRecipient.call{value: platformFee}("");
        require(success, "Fee transfer failed");
        
        // Refund excess payment
        uint256 excess = msg.value - platformFee;
        if (excess > 0) {
            (bool refundSuccess, ) = msg.sender.call{value: excess}("");
            require(refundSuccess, "Refund failed");
        }
        
        emit DropCreated(msg.sender, address(newDrop), _name);
        
        return address(newDrop);
    }
    
    /**
     * @dev Get all drops created by a specific creator
     * @param _creator Creator address
     * @return Array of drop contract addresses
     */
    function getCreatorDrops(address _creator) external view returns (address[] memory) {
        uint256 dropCount = creatorDrops[_creator].length();
        address[] memory drops = new address[](dropCount);
        
        for (uint256 i = 0; i < dropCount; i++) {
            drops[i] = creatorDrops[_creator].at(i);
        }
        
        return drops;
    }
    
    /**
     * @dev Get all drops created through the factory
     * @return Array of drop contract addresses
     */
    function getAllDrops() external view returns (address[] memory) {
        uint256 dropCount = allDrops.length();
        address[] memory drops = new address[](dropCount);
        
        for (uint256 i = 0; i < dropCount; i++) {
            drops[i] = allDrops.at(i);
        }
        
        return drops;
    }
    
    /**
     * @dev Get platform fee
     * @return Current platform fee in wei
     */
    function getPlatformFee() external view returns (uint256) {
        return platformFee;
    }
    
    /**
     * @dev Update platform fee
     * @param _newFee New platform fee in wei
     */
    function setPlatformFee(uint256 _newFee) external onlyOwner {
        platformFee = _newFee;
        emit PlatformFeeUpdated(_newFee);
    }
    
    /**
     * @dev Update fee recipient
     * @param _newRecipient New fee recipient address
     */
    function setFeeRecipient(address _newRecipient) external onlyOwner {
        require(_newRecipient != address(0), "Zero address");
        feeRecipient = _newRecipient;
        emit FeeRecipientUpdated(_newRecipient);
    }
    
    /**
     * @dev Withdraw any remaining ETH in the contract
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance");
        
        (bool success, ) = feeRecipient.call{value: balance}("");
        require(success, "Transfer failed");
    }
}
