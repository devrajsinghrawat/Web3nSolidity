pragma solidity >= 0.4.24;

contract SelfDesctructionContract {
   
   address payable owner;
   string public nameValue;
   
   modifier ownerRestricted {
      require(owner == msg.sender);
      _;
   } 
   
   constructor() payable public {
      owner = msg.sender;
   }
   
   // a simple setter function
   function setSomeValue(string memory value) public {
      nameValue = value;
   } 
   
   // Only authorized to called by owner
   function destroyContract() public ownerRestricted {
      selfdestruct(owner);
   }
   
   function() payable external {}
}