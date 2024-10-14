// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

interface IERC20 {
    function investorCoin() external view returns (uint256);

    function usersCoin() external view returns (uint256);

    function stakedTokens() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function burnInvestorToken(address recipient, uint256 amount)
        external
        returns (bool);
       function transfer(address recipient, uint256 amount)
        external
        returns (bool);    

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function investorTransferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function userTransferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

library SafeMath {
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}

contract MervCoin is IERC20 {
    using SafeMath for uint256;

    string public name;
    string public symbol;
    uint256 private peterCoin_;
    uint256 private usersCoin_;
    uint256 private ronCoin_;
    uint256 private investorCoin_;
    uint256 private stakedToken_;
    mapping(address => uint256) totalInvestorBal;
    mapping(address => uint256) totalStakedTokens;
    mapping(address => uint256) totalPeterBal;
    mapping(address => uint256) totalRonBal;
    mapping(address => uint256) totalUsersBal;
    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowed;

    constructor() {
        name = "G2F Coin";
        symbol = "G2F";                                    // tokens total supply is needed to be discussed
        investorCoin_ = 125000000 * (10**18);              // 750 million // Have to fix and understand this value not sure about the tokenomics
        totalInvestorBal[msg.sender] = investorCoin_;
        stakedToken_ = 525000000 * (10**18);                // initial staked tokens 
        totalStakedTokens[msg.sender] = stakedToken_;
        usersCoin_ = 350000000 * (10**18);                 // 125 million unstaked tokens which will reward in the firt year on every ticket purchase
        totalUsersBal[msg.sender] = usersCoin_;

    }
    function investorCoin() public view override returns (uint256) {
        return investorCoin_;
    }

    function usersCoin() public view override returns (uint256) {
        return usersCoin_;
    }

    function stakedTokens() public view override returns (uint256){
        return stakedToken_;
    }

    function balanceOf(address tokenOwner)
        public
        view
        override
        returns (uint256)
    {
        return balances[tokenOwner];
    }

    function investorCoin(address tokenOwner) external view returns (uint256) {
        return totalInvestorBal[tokenOwner];
    }

    function usersCoin(address tokenOwner) external view returns (uint256) {
        return totalUsersBal[tokenOwner];
    }

    function stakedCoin(address tokenOwner) external view returns (uint256){
        return totalStakedTokens[tokenOwner];
    }

    function transfer(address receiver, uint256 numTokens)
        public
        override
        returns (bool)
    {
        require(numTokens <= balances[msg.sender],"Not enough balance in Transfer");
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
        balances[receiver] = balances[receiver].add(numTokens);
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }


    function mervTransferfrom(address sender,address receiver, uint256 numTokens)
        public
        payable
        returns (bool)
    {    
        require(numTokens <= totalInvestorBal[sender],"Here we are checking the user merv balance");
        totalInvestorBal[sender] = totalInvestorBal[sender].sub(numTokens);
        // totalInvestorBal[receiver] = totalInvestorBal[receiver].add(numTokens);
        totalStakedTokens[receiver] = totalStakedTokens[receiver].add(numTokens);
        return true;
    }

    function approve(address delegate, uint256 numTokens)
        public
        override
        returns (bool)
    {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }

    function allowance(address owner, address delegate)
        public
        view
        override
        returns (uint256)
    {
        return allowed[owner][delegate];
    }

    function transferFrom(
        address owner,
        address buyer,
        uint256 numTokens
    ) public override returns (bool) {
        require(numTokens <= balances[owner]);
        require(numTokens <= allowed[owner][msg.sender]);
        balances[owner] = balances[owner].sub(numTokens);
        allowed[owner][msg.sender] = allowed[owner][msg.sender].sub(numTokens);
        balances[buyer] = balances[buyer].add(numTokens);
        emit Transfer(owner, buyer, numTokens);
        return true;
    }

    function investorTransferFrom(
        address owner,
        address buyer,
        uint256 numTokens
    ) public override returns (bool) {
        require(numTokens <= totalInvestorBal[owner]);
        require(numTokens <= allowed[owner][msg.sender]);
        totalInvestorBal[owner] = totalInvestorBal[owner].sub(numTokens);
        allowed[owner][msg.sender] = allowed[owner][msg.sender].sub(numTokens);
        totalInvestorBal[buyer] = totalInvestorBal[buyer].add(numTokens);
        emit Transfer(owner, buyer, numTokens);
        return true;
    }

    function burnInvestorToken(address owner,uint256 numTokens) public override returns (bool) {
        require(numTokens <= totalInvestorBal[owner]);
        require(numTokens <= allowed[owner][msg.sender]);
        totalInvestorBal[owner] = totalInvestorBal[owner].sub(numTokens);
        return true;
    }

    function userTransferFrom(
        address owner,
        address buyer,
        uint256 numTokens
    ) public override returns (bool) {
        require(numTokens <= totalUsersBal[owner]);
        require(numTokens <= allowed[owner][msg.sender]);
        totalUsersBal[owner] = totalUsersBal[owner].sub(numTokens);
        allowed[owner][msg.sender] = allowed[owner][msg.sender].sub(numTokens);
        totalUsersBal[buyer] = totalUsersBal[buyer].add(numTokens);
        emit Transfer(owner, buyer, numTokens);
        return true;
    }
}

