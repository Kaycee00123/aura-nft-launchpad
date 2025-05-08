// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title NFTDrop
 * @dev NFT Drop contract for launchpad platform
 */
contract NFTDrop is ERC721, ERC721Enumerable, Ownable {
    using Strings for uint256;
    
    // Collection info
    uint256 public maxSupply;
    uint256 public mintPrice;
    bool public isSoulbound;
    bool public canBurn;
    address public creator;
    string public baseTokenURI;
    string public logoURI;
    string public bannerURI;

    // Mint schedule
    uint256 public mintStart;
    uint256 public mintEnd;

    // Whitelist
    bool public isWhitelistEnabled = false;
    bytes32 public merkleRoot;

    // Events
    event MintCompleted(address indexed minter, uint256 quantity);
    event BurnCompleted(address indexed burner, uint256 tokenId);
    event WhitelistUpdated(bool enabled, bytes32 merkleRoot);
    event MintDatesUpdated(uint256 mintStart, uint256 mintEnd);
    
    /**
     * @dev Constructor to initialize the NFT Drop
     */
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _maxSupply,
        uint256 _mintPrice,
        bool _isSoulbound,
        bool _canBurn,
        string memory _baseTokenURI,
        string memory _logoURI,
        string memory _bannerURI,
        address _creator
    ) ERC721(_name, _symbol) Ownable(_creator) {
        maxSupply = _maxSupply;
        mintPrice = _mintPrice;
        isSoulbound = _isSoulbound;
        canBurn = _canBurn;
        baseTokenURI = _baseTokenURI;
        logoURI = _logoURI;
        bannerURI = _bannerURI;
        creator = _creator;
        
        // Default mint period: now + 1 year
        mintStart = block.timestamp;
        mintEnd = block.timestamp + 365 days;
    }
    
    /**
     * @dev Public mint function
     * @param quantity Number of NFTs to mint
     */
    function mint(uint256 quantity) external payable {
        require(block.timestamp >= mintStart, "Mint not started");
        require(block.timestamp <= mintEnd, "Mint ended");
        require(!isWhitelistEnabled, "Whitelist only");
        require(totalSupply() + quantity <= maxSupply, "Exceeds max supply");
        require(msg.value >= mintPrice * quantity, "Insufficient payment");
        
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = totalSupply() + 1;
            _safeMint(msg.sender, tokenId);
        }
        
        emit MintCompleted(msg.sender, quantity);
    }
    
    /**
     * @dev Whitelist mint function with Merkle proof
     * @param quantity Number of NFTs to mint
     * @param merkleProof Merkle proof of whitelist inclusion
     */
    function whitelistMint(uint256 quantity, bytes32[] calldata merkleProof) external payable {
        require(block.timestamp >= mintStart, "Mint not started");
        require(block.timestamp <= mintEnd, "Mint ended");
        require(isWhitelistEnabled, "Whitelist not enabled");
        require(totalSupply() + quantity <= maxSupply, "Exceeds max supply");
        require(msg.value >= mintPrice * quantity, "Insufficient payment");
        
        // Verify the merkle proof
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProof.verify(merkleProof, merkleRoot, leaf), "Invalid proof");
        
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = totalSupply() + 1;
            _safeMint(msg.sender, tokenId);
        }
        
        emit MintCompleted(msg.sender, quantity);
    }
    
    /**
     * @dev Burn NFT if burning is enabled
     * @param tokenId Token ID to burn
     */
    function burn(uint256 tokenId) external {
        require(canBurn, "Burning not enabled");
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not approved");
        
        _burn(tokenId);
        emit BurnCompleted(msg.sender, tokenId);
    }
    
    /**
     * @dev Set whitelist status and merkle root
     * @param _enabled Whether whitelist is enabled
     * @param _merkleRoot Merkle root of whitelist addresses
     */
    function setWhitelist(bool _enabled, bytes32 _merkleRoot) external onlyOwner {
        isWhitelistEnabled = _enabled;
        merkleRoot = _merkleRoot;
        
        emit WhitelistUpdated(_enabled, _merkleRoot);
    }

    /**
     * @dev Enable/disable whitelist only
     * @param _enabled Whether whitelist is enabled
     */
    function setWhitelistEnabled(bool _enabled) external onlyOwner {
        isWhitelistEnabled = _enabled;
        
        emit WhitelistUpdated(_enabled, merkleRoot);
    }
    
    /**
     * @dev Set merkle root for whitelist
     * @param _merkleRoot Merkle root of whitelist addresses
     */
    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
        
        emit WhitelistUpdated(isWhitelistEnabled, _merkleRoot);
    }
    
    /**
     * @dev Set mint dates
     * @param _mintStart Start timestamp for minting
     * @param _mintEnd End timestamp for minting
     */
    function setMintDates(uint256 _mintStart, uint256 _mintEnd) external onlyOwner {
        require(_mintEnd > _mintStart, "End must be after start");
        
        mintStart = _mintStart;
        mintEnd = _mintEnd;
        
        emit MintDatesUpdated(_mintStart, _mintEnd);
    }
    
    /**
     * @dev Toggle soulbound status
     * @param _isSoulbound Whether NFTs are soulbound
     */
    function setSoulbound(bool _isSoulbound) external onlyOwner {
        isSoulbound = _isSoulbound;
    }
    
    /**
     * @dev Toggle burn capability
     * @param _canBurn Whether NFTs can be burned
     */
    function setBurn(bool _canBurn) external onlyOwner {
        canBurn = _canBurn;
    }
    
    /**
     * @dev Withdraw contract balance to creator
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = creator.call{value: balance}("");
        require(success, "Transfer failed");
    }
    
    /**
     * @dev Override _baseURI from ERC721
     */
    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }
    
    /**
     * @dev Override tokenURI from ERC721
     * @param tokenId Token ID
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        string memory base = _baseURI();
        if (bytes(base).length == 0) {
            return logoURI;
        }

        // If base URI contains {id}, replace it with tokenId
        if (bytes(base).length > 0 && contains(base, "{id}")) {
            string memory tokenIdStr = tokenId.toString();
            return replace(base, "{id}", tokenIdStr);
        }

        // Otherwise append tokenId to base URI
        return string(abi.encodePacked(base, tokenId.toString()));
    }

    /**
     * @dev Check if a string contains a substring
     */
    function contains(string memory source, string memory search) internal pure returns (bool) {
        bytes memory sourceBytes = bytes(source);
        bytes memory searchBytes = bytes(search);
        
        if (sourceBytes.length < searchBytes.length) {
            return false;
        }
        
        for (uint i = 0; i <= sourceBytes.length - searchBytes.length; i++) {
            bool found = true;
            
            for (uint j = 0; j < searchBytes.length; j++) {
                if (sourceBytes[i + j] != searchBytes[j]) {
                    found = false;
                    break;
                }
            }
            
            if (found) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * @dev Replace placeholder in string
     */
    function replace(string memory source, string memory search, string memory replacement) internal pure returns (string memory) {
        bytes memory sourceBytes = bytes(source);
        bytes memory searchBytes = bytes(search);
        bytes memory replacementBytes = bytes(replacement);
        
        // Find position of search string
        uint256 pos = 0;
        bool found = false;
        
        for (uint i = 0; i <= sourceBytes.length - searchBytes.length; i++) {
            bool match = true;
            
            for (uint j = 0; j < searchBytes.length; j++) {
                if (sourceBytes[i + j] != searchBytes[j]) {
                    match = false;
                    break;
                }
            }
            
            if (match) {
                pos = i;
                found = true;
                break;
            }
        }
        
        if (!found) {
            return source;
        }
        
        // Build result string
        bytes memory result = new bytes(sourceBytes.length - searchBytes.length + replacementBytes.length);
        
        // Copy part before search string
        for (uint i = 0; i < pos; i++) {
            result[i] = sourceBytes[i];
        }
        
        // Copy replacement string
        for (uint i = 0; i < replacementBytes.length; i++) {
            result[pos + i] = replacementBytes[i];
        }
        
        // Copy part after search string
        for (uint i = 0; i < sourceBytes.length - pos - searchBytes.length; i++) {
            result[pos + replacementBytes.length + i] = sourceBytes[pos + searchBytes.length + i];
        }
        
        return string(result);
    }
    
    /**
     * @dev Override transfer functions for soulbound tokens
     */
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal override(ERC721, ERC721Enumerable) {
        // If tokens are soulbound and it's not a mint operation (from != address(0)), prevent transfer
        if (isSoulbound && from != address(0) && to != address(0)) {
            revert("Token is soulbound");
        }
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    /**
     * @dev Required overrides for ERC721Enumerable
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
