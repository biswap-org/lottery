# **Pancake Lottery**

  

First, we will deploy all three contracts.

These are:

-   Random Generator Contract
    
-   Baby Token Contract
    
-   Lottery Contract
    

  

**Baby Token Contract:**

Owner has to deploy the token contract so that the users can buy them to buy tickets.

  

**Random Generator Contract:**

To deploy this contract, we need two other contract addresses:

-   VRF Coordinator
    
-   LINK token
    

These addresses will get from given Link:

[https://docs.chain.link/docs/vrf/v1/supported-networks/](https://docs.chain.link/docs/vrf/v1/supported-networks/)

  

After deploying this contract, we will set **“LINK Token Fee”** and **“Key Hash Address”.**

Then send some LINK tokens to Random Generator Contract to make a lottery claim.

Once the lottery is over. We can check the generated random number and Lottery ID in the Random Generator Contract.

  

**Pancake Lottery:**

Once the “Random Generator” contract and “Baby Token” contract are generated, we use their address to deploy the lottery contract.

After deployment, we pass its address into the Random generator contract. So that we can get the random number from the Random Generator contract.

  

After deploying the contract, we will set the addresses in the “setOperatorAndTreasuryAndInjectorAddresses” function.

The addresses are:

-   Operator
    
-   Treasury and
    
-   Injector
    

  

**Operator Address:**

This address will control all the functionalities of the contract. Whether it is related to starting the lottery or to end the lottery or any other function.

  

**Treasury Address:**

This address will get the burning amount of tokens which is given by the user when he buys the lottery. Some percentage will directly go to this address.

  

**Injector Address:**

This address will be used to send funds in this contract if this contract will have less balance than the transfer.

  

**StratLottery Function:**

In this function, we will set the parameters as:

  

endTime (endTime of Lottery)

TicketPrice  (in baby tokens)

discountDivisor(Minimum 300). This is the discount the owner will give to those users who will buy more than 1 ticket.

rewardBreakdown  (set rewards for each bracket).

treasuryFee (maximum 3000). This is the percentage, owner sets as a burning amount.

  

**buyTicket Function:**

Any user can buy the tickets through this function. There we have an array for buying multiple tickets. For buying tickets, users have to have the baby tokens in their account. If the users have no tokens, they can not buy the tickets.

  

**closeLottery Function:**

After the time is over, the operator address has to call this function to close the lottery to select the winner.

  

**drawFinalNumberAndMakeLotteryClaimable:**

In this function, after closing the lottery, the operator will set the parameters as:

-   Lottery Id
    
-   autoInjection
    

This function will get the generated random number from Random Generator Contract’s function “viewRandomResult”. Then make some calculations and then make the lottery claimable.

  

**claimTicket:**

After the previous function is done, the user can claim the reward against the winning ticket number as if the one digit of the lottery is matched with the generated Random number. Then he will get the reward made against the first digit and so on to 6 digits.

  

There are some other functions in this contract. e.g.

  

**changeRandomGenerator Function:**

This function will change the address of the random generator address. Only Owner can call this function. Not even the operator address can call this function.

**InjectFunds Function:**

This function can call only the owner or the injector. In this function, the injector/owner sends funds to this contract externally. This is used in case if the contract has less balance than to transfer.

  

**recoverWrongTokens Function:**

This function is used to get back the tokens from this contract other than babyTokens. This function is also only callable by the owner.

  

**setMaxNumberTicketsPerBuy Function:**

By default users can buy 100 tickets in a single transaction. But the Owner can change its value at any time.

  

**setMinAndMaxTicketPriceInCake Function:**

Owner can change the price of the ticket at any time. e.g. if the current price is 10 tokens and the owner wants to change its price. He can set from this function.

  

  

There are some view functions like:

  

**viewUserInfoForLotteryId Function:**

In this function, the user can check his total tickets and their statuses (whether those tickets are claimable or not).

  

**viewRewaradForTicketId Function:**

In this function, the user can check his reward against a single ticketId.
