// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "./ERC721.sol";
// import "./ERC721Burnable.sol";
import "./Ownable.sol";
import "./Counters.sol";
import "./MervCoin.sol";

contract Lottery is ERC721, Ownable {
    using Counters for Counters.Counter;
    address payable public admin;
    address[] public lotteryTicketholder;
    uint256 public startInvTimestamp;
    uint256 public endInvTimestamp;
    uint256 public maxInvestToken;
    uint256 public tokenPrice;
    address private mervCoin;
    uint256 public peterCoin_;
    uint256 public ronCoin_;
    bool public invPeter=true;
    bool public invRon=true;

    mapping(address => uint256) public _userBalances;
    mapping(uint256 => lotteryBuyerDetail) public NFTDetails;
    mapping(string => userPurchasedLottery[]) public userByLotteryId;
    event ticketNft(
        string lotteryId,
        uint256[] nftArray,
        address indexed buyer
    );
    Counters.Counter private _tokenIdCounter;

    struct userPurchasedLottery {
        address _user;
    }
    struct lotteryBuyerDetail {
        address _address;
        string _lotteryName;
        uint256 _ticketPrice;
        uint256 _numOfTicketOnSale;
        uint256 _startDateAndTime;
        uint256 _endDateAndTime;
        uint256 _lotteryDrawDate;
        uint256 _lotteryDrawTime;
        uint256 _totalDraw;
        uint256 _lotteryNftId;
        string _lotteryId;
        uint256 _ticketNumber;
    }

    constructor(address _mervCoin) payable ERC721("MERVCF Coin", "MERVCF") {
        admin = payable(msg.sender);
        mervCoin = _mervCoin;
        peterCoin_ = 50000000;
        ronCoin_ = 50000000;
    }

    function mintLotteryTicket(
        address _address,
        string memory _lotteryName,
        uint256 _ticketPrice,
        uint256 _ticketTotalPrice,
        uint256 _numOfTicketpurchase,
        uint256 _startDateAndTime,
        uint256 _endDateAndTime,
        uint256 _lotteryDrawDate,
        uint256 _lotteryDrawTime,
        uint256 _totalDraw,
        string memory _lotteryId
    ) external {
        require(msg.sender == _address, "Invalid address for minting !");
        require(_address != address(0), "Invalid buyerAddress !");
        require(
            admin != address(0),
            "ERC721: From address zero is not a valid"
        );
        require(
            _userBalances[_address] >= _ticketTotalPrice,
            "ERC721: Insufficient fund to mint ticket"
        );
        _userBalances[_address] = _userBalances[_address] - _ticketTotalPrice;
        _userBalances[admin] = _userBalances[admin] + _ticketTotalPrice;
        uint256[] memory nftArray = new uint256[](_numOfTicketpurchase);
        for (uint256 i = 0; i < _numOfTicketpurchase; i++) {
            _tokenIdCounter.increment();
            uint256 _lotteryNftId = _tokenIdCounter.current();
            NFTDetails[_lotteryNftId] = lotteryBuyerDetail(
                msg.sender,
                _lotteryName,
                _ticketPrice,
                1,
                _startDateAndTime,
                _endDateAndTime,
                _lotteryDrawDate,
                _lotteryDrawTime,
                _totalDraw,
                _lotteryNftId,
                _lotteryId,
                0
            );
            //mint batch for property
            _safeMint(msg.sender, _lotteryNftId, "0x00");
            nftArray[i] = _lotteryNftId;
            // lotteryTicketholder.push(msg.sender);
            userByLotteryId[_lotteryId].push(userPurchasedLottery(msg.sender));
        }
        emit ticketNft(_lotteryId, nftArray, msg.sender);
    }

    function userLotteryId(string memory _lotteryId)
        external
        view
        returns (userPurchasedLottery[] memory)
    {
        return userByLotteryId[_lotteryId];
    }

    function fetchLotteryNFT()
        external
        view
        returns (lotteryBuyerDetail[] memory)
    {
        uint256 totalItemCount = _tokenIdCounter.current();
        uint256 currentIndex = 0;
        lotteryBuyerDetail[] memory items = new lotteryBuyerDetail[](
            totalItemCount
        );
        for (uint256 j = 1; j <= totalItemCount; ++j) {
            lotteryBuyerDetail storage currentItem = NFTDetails[j];
            items[currentIndex] = currentItem;
            currentIndex += 1;
        }
        return items;
    }

    function fetchUserPurchaseNFT()
        external
        view
        returns (lotteryBuyerDetail[] memory)
    {
        uint256 totalItemCount = _tokenIdCounter.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;
        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (NFTDetails[i]._address == msg.sender) {
                itemCount += 1;
            }
        }
        lotteryBuyerDetail[] memory items = new lotteryBuyerDetail[](itemCount);
        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (NFTDetails[i]._address == msg.sender) {
                uint256 currentId = i;
                lotteryBuyerDetail storage currentItem = NFTDetails[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function randomNumbersGenerate(
        string memory _lotteryId,
        uint256[] memory _initialTab
    ) external view returns (uint256[] memory) {
        uint256 p = _initialTab.length;
        uint256 k = _initialTab.length;
        //generate random number
        // be aware that block.timestamp can be alter by miners.
        for (uint256 i = 0; i < k; i++) {
            uint256 randNum = (uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        _lotteryId,
                        _initialTab[i]
                    )
                )
            ) % p) + 1;
            uint256 tmp = _initialTab[randNum - 1];
            _initialTab[randNum - 1] = _initialTab[p - 1];
            _initialTab[p - 1] = tmp;
            p = p - 1;
        }
        uint256[] memory res;
        res = _initialTab;
        return res;
    }

    function coinTransferToUser(address _toAddress, uint256 _amount)
        external
        returns (uint256)
    {
        require(
            _toAddress != address(0),
            "ERC721: address zero is not a valid owner"
        );
        require(msg.sender==admin,"Admin Authentication Error!");
        _userBalances[_toAddress] = _userBalances[_toAddress] + _amount;
        return _userBalances[_toAddress];
    }

    function userWalletBalMinus(address _toAddress, uint256 _amount) external returns (uint256)
    {
        require(
            _toAddress != address(0),
            "ERC721: address zero is not a valid owner"
        );
        require(msg.sender==admin,"Admin Authentication Error!");
        _userBalances[_toAddress] = _userBalances[_toAddress] - _amount;
        return _userBalances[_toAddress];
    }

    function transferFund(address receiver, uint256 _amt)
       external
    {
         require(receiver != address(0), "ERC721: transfer to the zero address");
         require(admin == msg.sender, "Admin and sender is not same");
        require(_amt <= _userBalances[admin],"Insufficient fund to transfer with receiver");
        _userBalances[receiver] = _userBalances[receiver] + _amt;
        _userBalances[admin] = _userBalances[admin] - _amt;
        emit Transfer(receiver, admin, _amt);
    }

    function userBalance(address _userBal) external view returns (uint256) {
        require(_userBal != address(0), "Invalid user balance address");
        return _userBalances[_userBal];
    }

    function investorBal(address _invBal) external view returns (uint256) {
        require(_invBal != address(0), "Invalid investor balance address");
        return MervCoin(mervCoin).investorCoin(_invBal);
    }

    function setInvStartEndTime(
        uint256 _startInvTimestamp,
        uint256 _endInvTimestamp,
        uint256 _maxToken,
        uint256 _tokenPrice
    ) external onlyOwner {
        startInvTimestamp = _startInvTimestamp;
        endInvTimestamp = _endInvTimestamp;
        maxInvestToken = _maxToken;
        tokenPrice = _tokenPrice;
    }

    function changeOwner(address newOwner) external onlyOwner {
        admin = payable(newOwner);
    }

    function investorMervTransfer(address receiver, uint256 numTokens)
        external
        payable
        returns (bool)
    {
        uint256 totalTknPrice = tokenPrice * numTokens;
        // require(invPeter==true && invRon==true ,"First, peter and ron get its investment coin");
        require(
            endInvTimestamp != 0 || startInvTimestamp != 0,
            "Admin didn't set investment start and end time"
        );
        require(
            block.timestamp >= startInvTimestamp,
            "Investment time doesn't started"
        );
        require(
            endInvTimestamp >= block.timestamp,
            "Investment time has been ended"
        );
        require(admin != receiver, "Sender and receiver are not equal");
        require(
            numTokens <= maxInvestToken,
            "Investor token purchase limit excessed"
        );
        require(
            totalTknPrice != 0 && _userBalances[receiver] >= totalTknPrice,
            "Receiver don't have enough balance"
        );
        // _userBalances[receiver] = _userBalances[receiver] - totalTknPrice;
        // _userBalances[admin] = _userBalances[admin] + totalTknPrice;
        MervCoin(mervCoin).investorTransferFrom(admin, receiver, totalTknPrice);
        emit Transfer(admin, receiver, numTokens);
        return true;
    }   

    function jackpotMervTransfer(address sender, address receiver, uint mervTokens) external payable returns (bool){

        require(receiver != sender,"Cannot send to yourself");
        require(receiver != address(0) && sender != address(0),"address zero is not a valid address");
        require(mervTokens != 0, "Sending amount can't be zero");
        MervCoin(mervCoin).mervTransferfrom(sender,receiver,mervTokens);

        return true;
    } 

    function burnInvestorTokens(uint256 numTokens)
        external
        payable
        returns (bool)
    {
        // require(invPeter==true && invRon==true ,"First, peter and ron get its investment coin");
        require(
            endInvTimestamp != 0 || startInvTimestamp != 0,
            "Admin didn't set investment start and end time"
        );
        require(
            block.timestamp >= startInvTimestamp,
            "Investment time doesn't started"
        );
        require(
            endInvTimestamp >= block.timestamp,
            "Investment time has been ended"
        );
        require(
            numTokens <= maxInvestToken,
            "Investor token purchase limit excessed"
        );
        MervCoin(mervCoin).burnInvestorToken(admin, numTokens);
        return true;
    }

    function userMervTransfer(address receiver, uint256 numTokens)
        external
        payable
        returns (bool)
    {
        require(admin != receiver, "Sender and receiver are not equal");
        require(msg.sender == receiver || msg.sender == admin, "Only Receiver can be received coin");
        MervCoin(mervCoin).userTransferFrom(admin, receiver, numTokens);
        emit Transfer(admin, receiver, numTokens);
    return true; 
    }

    function peterMervTransfer(address receiver)
        external
        payable
    {
        require(admin != receiver, "Sender and receiver are not equal");
        MervCoin(mervCoin).investorTransferFrom(admin, receiver, peterCoin_);
        invPeter=true;
    }

    function ronMervTransfer(address receiver)
        external
        payable
    {
        require(admin != receiver, "Sender and receiver are not equal");
        MervCoin(mervCoin).investorTransferFrom(admin, receiver, ronCoin_);
        invRon=true;
    }
}

