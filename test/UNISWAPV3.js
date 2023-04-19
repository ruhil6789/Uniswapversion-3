const { expect } = require("chai");
const { ethers } = require("hardhat");
const {describe} = require("mocha");
require("@nomicfoundation/hardhat-chai-matchers");

const { BigNumber } = require("@ethersproject/bignumber");
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");




 describe("Testing UNISWAPV3 function", function (){

    beforeEach(async ()=>{

        [owner, user1 ,user2, user3, lptoken, lptoken1, lptoken2, user4, user5, ...addrs] = await ethers.getSigners();

        TOKEN1 = await ethers.getContractFactory("FIRSTTOKEN");
        token1 = await TOKEN1.deploy();
        console.log("token1",token1.address);


        TOKEN2 = await ethers.getContractFactory("SECONDTOKEN");
        token2 = await TOKEN2.deploy();
        console.log("token2",token2.address);


        TOKEN3 = await ethers.getContractFactory("THIRDTOKEN");
        token3 = await TOKEN3.deploy(); // this token used for multihop swap.

        //console.log("token3",token3.address);
   
        UNISWAPV3FACTORY = await ethers.getContractFactory("UniswapV3Factory");
        uniswapv3factory = await UNISWAPV3FACTORY.deploy();

        WETH = await ethers.getContractFactory("WETH");
        weth = await WETH.deploy();

    
        SWAPROUTER = await ethers.getContractFactory("SwapRouter");
        swaprouter = await SWAPROUTER.deploy(uniswapv3factory.address,weth.address);
       // console.log("swaprouter===============",await swaprouter.address )

        NFTDescriptor = await ethers.getContractFactory("NFTDescriptor");
        nftdescriptor = await NFTDescriptor.deploy();

        //console.log("nftdescriptor+++++++++++++++",await nftdescriptor.address);

        NonfungibleTokenPositionDescriptor = await ethers.getContractFactory("NonfungibleTokenPositionDescriptor", {libraries: {NFTDescriptor: nftdescriptor.address }});
        nonfungibletokenpositiondescriptor = await NonfungibleTokenPositionDescriptor.deploy(weth.address,"0x7dd481eb4b63b94bb55e6b98aabb06c3b8484f82a4d656d6bca0b0cf9b446be0");

        NONFungiblePositionManager  = await ethers.getContractFactory("NonfungiblePositionManager");
        nonfungiblePositionManager  = await  NONFungiblePositionManager.deploy(uniswapv3factory.address,weth.address,nonfungibletokenpositiondescriptor.address);
       
       // console.log("nonfungiblePositionManager+++++++++++++++++++",await nonfungiblePositionManager.address);

       
        
    })

      it.only("DIFFERNT RATIO ADD LIQUIDITY",async()=>{

        GETINIT = await ethers.getContractFactory("CalHash");
        getinit = await GETINIT.deploy();
        hash = await getinit.getInitHash();
       //console.log("hash++++++++++",hash);
       //console.log(token1.address, token2.address);

        const bal = await token1.balanceOf(owner.address);
        //console.log("bal+++++++++++++",bal);

        await token1.approve(nonfungiblePositionManager.address,BigNumber.from("1000").mul(BigNumber.from(10).pow(18)));  
        const allowance =  await token1.allowance(owner.address,nonfungiblePositionManager.address);
        //console.log("allowance==================",allowance);

        await token2.approve(nonfungiblePositionManager.address,BigNumber.from("1000").mul(BigNumber.from(10).pow(18)));
        const baloff =  await token2.balanceOf(owner.address);
        //console.log("baloff+=================",baloff);


        // await uniswapv3factory.createPool(token1.address,token2.address,500);//707593543950336
        // GetPairAddress = await uniswapv3factory.getPool(token1.address,token2.address,500);1.5845632502852868e+29
        //159228162514864337593543950336n
        // 79228162514264337593543950336X2
        // 10000000000000000000000000000
        //ticklower -600000
        //tickupper 600000

        //158456325028528675187087900772n
        await nonfungiblePositionManager.createAndInitializePoolIfNecessary(token1.address,token2.address,3000,5602277097478614198912276234240n)
      
        await nonfungiblePositionManager.mint(
            [   token1.address,
                token2.address,         
                fee = 3000,
                tickLower = -84240,
                tickUpper = 86160,
                feeGrowthInside0LastX128 =  BigNumber.from("5000").mul(BigNumber.from(10).pow(18)),
                feeGrowthInside1LastX128 =  BigNumber.from("1").mul(BigNumber.from(10).pow(18)),
                tokensOwed0 =  0,
                tokensOwed1 =  0,
                owner.address,
                1669999614]
           )

           GetPairAddress = await uniswapv3factory.getPool(token1.address,token2.address,3000);
           UNISWAPV3POOL = await ethers.getContractFactory("UniswapV3Pool");
           UniswapV3Pool = await UNISWAPV3POOL.attach(GetPairAddress);


           const reserve0 = await token1.balanceOf( UniswapV3Pool.address);
           console.log("reserve0 +=============================",reserve0 );
           const reserve1 = await token2.balanceOf( UniswapV3Pool.address);
           console.log("reserve1+=============================",reserve1);

           pos = await nonfungiblePositionManager.positions(1);
          //  console.log(pos)

        //    expect(reserve1.eq("5000000000000000000")).to.be.true;
        //    expect(reserve0.eq("5000000000000000000")).to.be.true;
           //expect(_bal.toString()).to.equal(`${4 * 10 ** 18}`);
           
           


    })
    it("SAME RATIO ADD LIQUIDITY",async()=>{

        GETINIT = await ethers.getContractFactory("CalHash");
        getinit = await GETINIT.deploy();
        hash = await getinit.getInitHash();
       //console.log("hash++++++++++",hash);
       //console.log(token1.address, token2.address);

        const bal = await token1.balanceOf(owner.address);
        //console.log("bal+++++++++++++",bal);

        await token1.approve(nonfungiblePositionManager.address,BigNumber.from("1000").mul(BigNumber.from(10).pow(18)));  
        const allowance =  await token1.allowance(owner.address,nonfungiblePositionManager.address);
        //console.log("allowance==================",allowance);

        await token2.approve(nonfungiblePositionManager.address,BigNumber.from("1000").mul(BigNumber.from(10).pow(18)));
        const baloff =  await token2.balanceOf(owner.address);
        //console.log("baloff+=================",baloff);


        // await uniswapv3factory.createPool(token1.address,token2.address,500);//707593543950336
        // GetPairAddress = await uniswapv3factory.getPool(token1.address,token2.address,500);1.5845632502852868e+29
        //159228162514864337593543950336n
        // 79228162514264337593543950336X2
        // 10000000000000000000000000000
        await nonfungiblePositionManager.createAndInitializePoolIfNecessary(token1.address,token2.address,3000,79228162514264337593543950336n)
      
        await nonfungiblePositionManager.mint(
            [   token1.address,
                token2.address,         
                fee = 3000,
                tickLower = -120,
                tickUpper = 120,
                feeGrowthInside0LastX128 =  BigNumber.from("5").mul(BigNumber.from(10).pow(18)),
                feeGrowthInside1LastX128 =  BigNumber.from("5").mul(BigNumber.from(10).pow(18)),
                tokensOwed0 =  0,
                tokensOwed1 =  0,
                owner.address,
                1669999614]
           )

           GetPairAddress = await uniswapv3factory.getPool(token1.address,token2.address,3000);
           UNISWAPV3POOL = await ethers.getContractFactory("UniswapV3Pool");
           UniswapV3Pool = await UNISWAPV3POOL.attach(GetPairAddress);


           const reserve0 = await token1.balanceOf( UniswapV3Pool.address);
           console.log("reserve0 +=============================",reserve0 );
           const reserve1 = await token2.balanceOf( UniswapV3Pool.address);
           console.log("reserve1+=============================",reserve1);

           pos = await nonfungiblePositionManager.positions(1);
        //    console.log(pos)

           expect(reserve1.eq("5000000000000000000")).to.be.true;
           expect(reserve0.eq("5000000000000000000")).to.be.true;
           //expect(_bal.toString()).to.equal(`${4 * 10 ** 18}`);
           
           


    })

    it("REMOVE LIQUIDITY",async()=>{

        GETINIT = await ethers.getContractFactory("CalHash");
        getinit = await GETINIT.deploy();
        hash = await getinit.getInitHash();
       //console.log("hash++++++++++",hash);
       //console.log(token1.address, token2.address);

        const bal = await token1.balanceOf(owner.address);
        //console.log("bal+++++++++++++",bal);

        await token1.approve(nonfungiblePositionManager.address,BigNumber.from("1000").mul(BigNumber.from(10).pow(18)));  
        const allowance =  await token1.allowance(owner.address,nonfungiblePositionManager.address);
        //console.log("allowance==================",allowance);

        await token2.approve(nonfungiblePositionManager.address,BigNumber.from("1000").mul(BigNumber.from(10).pow(18)));
        const baloff =  await token2.balanceOf(owner.address);
        //console.log("baloff+=================",baloff);


        await nonfungiblePositionManager.createAndInitializePoolIfNecessary(token1.address,token2.address,3000,79228162514264337593543950336n)
      
        await expect (nonfungiblePositionManager.mint(
            [   token1.address,
                token2.address,         
                fee = 3000,
                tickLower = -120,
                tickUpper = 120,
                feeGrowthInside0LastX128 =  BigNumber.from("2").mul(BigNumber.from(10).pow(18)),
                feeGrowthInside1LastX128 =  BigNumber.from("2").mul(BigNumber.from(10).pow(18)),
                tokensOwed0 =  0,
                tokensOwed1 =  0,
                owner.address,
                1669999614]
           ))
           .to.emit(nonfungiblePositionManager, 'IncreaseLiquidity')
           .withArgs(1,"334350999671639533818", 2000000000000000000n,2000000000000000000n);

           GetPairAddress = await uniswapv3factory.getPool(token1.address,token2.address,3000);
           UNISWAPV3POOL = await ethers.getContractFactory("UniswapV3Pool");
           UniswapV3Pool = await UNISWAPV3POOL.attach(GetPairAddress);


           const reserve0 = await token1.balanceOf( UniswapV3Pool.address);
           console.log("before removing liquidity :  reserve0 +=============================",reserve0 );
           const reserve1 = await token2.balanceOf( UniswapV3Pool.address);
           console.log("before removing liquidity :reserve1+=============================",reserve1);

           pos = await nonfungiblePositionManager.positions(1);
            //console.log(pos)
           const Owner = await nonfungiblePositionManager.balanceOf(owner.address);
           console.log("Owner",await nonfungiblePositionManager.balanceOf(owner.address));

       
       
            

            await nonfungiblePositionManager.decreaseLiquidity([1,334350999671639533818n,0,0,1764515896]);
            await nonfungiblePositionManager.collect([1,owner.address,2000000000000000000n,2000000000000000000n]);


            await nonfungiblePositionManager.burn(1);
            console.log("NFT balance after burn",await nonfungiblePositionManager.balanceOf(owner.address));

        
            const RESERVE_0 = await token1.balanceOf( UniswapV3Pool.address);
            console.log("after removing liquidity: reserve0 +=============================",RESERVE_0 );
            const RESERVE_1 = await token2.balanceOf( UniswapV3Pool.address);
            console.log("after removing liquidity: reserve1+=============================",RESERVE_1);
           


    })

    it("ExactInputSingleParams",async()=>{

        GETINIT = await ethers.getContractFactory("CalHash");
        getinit = await GETINIT.deploy();
        hash = await getinit.getInitHash();
       //console.log("hash++++++++++",hash);
       //console.log(token1.address, token2.address);

        const bal = await token1.balanceOf(owner.address);
        //console.log("bal+++++++++++++",bal);

         await token1.approve(nonfungiblePositionManager.address,BigNumber.from("50").mul(BigNumber.from(10).pow(18)));  
         const allowance =  await token1.allowance(owner.address,nonfungiblePositionManager.address);
        //console.log("allowance==================",allowance);

        await token2.approve(nonfungiblePositionManager.address,BigNumber.from("50").mul(BigNumber.from(10).pow(18)));
        const baloff =  await token2.balanceOf(owner.address);
        //console.log("baloff+=================",baloff);


        // 79228162514264337593543950336X2
        // 10000000000000000000000000000
        await nonfungiblePositionManager.createAndInitializePoolIfNecessary(token1.address,token2.address,3000,"79228162514264337593543950336")
      
        await nonfungiblePositionManager.mint(
            [   token1.address,
                token2.address,         
                fee = 3000,
                tickLower = -600000,
                tickUpper = 600000,
                feeGrowthInside0LastX128 =  BigNumber.from("10").mul(BigNumber.from(10).pow(18)),
                feeGrowthInside1LastX128 =  BigNumber.from("10").mul(BigNumber.from(10).pow(18)),
                tokensOwed0 =  0,
                tokensOwed1 =  0,
                owner.address,
                1669999614]
           )

           GetPairAddress = await uniswapv3factory.getPool(token1.address,token2.address,3000);
           UNISWAPV3POOL = await ethers.getContractFactory("UniswapV3Pool");
           UniswapV3Pool = await UNISWAPV3POOL.attach(GetPairAddress);


           const rreserve0 = await token1.balanceOf( UniswapV3Pool.address);
           console.log("before rreserve0 +=============================",rreserve0 );
           const rreserve1 = await token2.balanceOf( UniswapV3Pool.address);
           console.log("before reserve1+=============================",rreserve1);

         await token1.approve(swaprouter.address, 300000000000000000n);
         await swaprouter.exactInputSingle(   

           [tokenIn = token1.address,
            tokenOut = token2.address,
            fee = 3000,
            recipient = owner.address,
            deadline = 1669999614,
            amountIn = 300000000000000000n,
            amountOutMinimum = 0,
            sqrtPriceLimitX96 =  "69228162514264337593543950336"]  

           )
              console.log("\n=========================================================================");

             const reserve0 = await token1.balanceOf( UniswapV3Pool.address);
             console.log("after reserve0 +=============================",reserve0 );
             const reserve1 = await token2.balanceOf( UniswapV3Pool.address);
             console.log("after reserve1+=============================",reserve1);

       


    })  

    it("ExactOutputSingleParams",async()=>{

        GETINIT = await ethers.getContractFactory("CalHash");
        getinit = await GETINIT.deploy();
        hash = await getinit.getInitHash();
         console.log("hash++++++++++",hash);
       //console.log(token1.address, token2.address);

        const bal = await token1.balanceOf(owner.address);
        //console.log("bal+++++++++++++",bal);

        await token1.approve(nonfungiblePositionManager.address,BigNumber.from("50").mul(BigNumber.from(10).pow(18)));  
        const allowance =  await token1.allowance(owner.address,nonfungiblePositionManager.address);
        //console.log("allowance==================",allowance);

        await token2.approve(nonfungiblePositionManager.address,BigNumber.from("50").mul(BigNumber.from(10).pow(18)));
        const baloff =  await token2.balanceOf(owner.address);
        //console.log("baloff+=================",baloff);


      
        await nonfungiblePositionManager.createAndInitializePoolIfNecessary(token1.address,token2.address,3000,79228162514264337593543950336n)
      
        await nonfungiblePositionManager.mint(
            [   token1.address,
                token2.address,         
                fee = 3000,
                tickLower = -120,
                tickUpper = 120,
                feeGrowthInside0LastX128 =  BigNumber.from("10").mul(BigNumber.from(10).pow(18)),
                feeGrowthInside1LastX128 =  BigNumber.from("10").mul(BigNumber.from(10).pow(18)),
                tokensOwed0 =  0,
                tokensOwed1 =  0,
                owner.address,
                1669999614]
           )

           GetPairAddress = await uniswapv3factory.getPool(token1.address,token2.address,3000);
           UNISWAPV3POOL = await ethers.getContractFactory("UniswapV3Pool");
           UniswapV3Pool = await UNISWAPV3POOL.attach(GetPairAddress);


           const rreserve0 = await token1.balanceOf( UniswapV3Pool.address);
           console.log("beforerreserve0 +=============================",rreserve0 );
           const rreserve1 = await token2.balanceOf( UniswapV3Pool.address);
           console.log("beforereserve1+=============================",rreserve1);

           const beforereward = await token2.balanceOf( owner.address);

           console.log("\nbeforereward==========================================================",beforereward);


          await token1.approve(swaprouter.address, 500000000000000000n);
                       
           await swaprouter.exactOutputSingle(   

           [tokenIn = token1.address,
            tokenOut = token2.address,
            fee = 3000,
            recipient = owner.address,
            deadline = 1669999614,
            amountOut = 300000000000000000n,
            amountInMaximum = 500000000000000000n,
            sqrtPriceLimitX96 =  69228162514264337593543950336n]           
           )

             const reserve0 = await token1.balanceOf( UniswapV3Pool.address);
              console.log("afterreserve0 +=============================",reserve0 );
              const reserve1 = await token2.balanceOf( UniswapV3Pool.address);
              console.log("afterreserve1+=============================",reserve1);

              const afterreward = await token2.balanceOf( owner.address);
              console.log("afterreward==========================================================",afterreward);


       


    })

    it("ExactInputParams",async()=>{


        GETINIT = await ethers.getContractFactory("CalHash");
        getinit = await GETINIT.deploy();
        hash = await getinit.getInitHash();
       //console.log("hash++++++++++",hash);
       //console.log(token1.address, token2.address);


        const bal = await token1.balanceOf(owner.address);
        //console.log("bal+++++++++++++",bal);

        await token1.approve(nonfungiblePositionManager.address,BigNumber.from("50").mul(BigNumber.from(10).pow(18)));  
        const allowance =  await token1.allowance(owner.address,nonfungiblePositionManager.address);
        //console.log("allowance==================",allowance);

        await token2.approve(nonfungiblePositionManager.address,BigNumber.from("50").mul(BigNumber.from(10).pow(18)));
        const baloff =  await token2.balanceOf(owner.address);
        console.log("baloff+=================",baloff);




     

        await nonfungiblePositionManager.createAndInitializePoolIfNecessary(token1.address,token2.address,3000,79228162514264337593543950336n)

      
        await nonfungiblePositionManager.mint(
            [   token1.address,
                token2.address,         
                fee = 3000,
                tickLower = -600000,
                tickUpper = 600000,
                feeGrowthInside0LastX128 =  BigNumber.from("10").mul(BigNumber.from(10).pow(18)),
                feeGrowthInside1LastX128 =  BigNumber.from("10").mul(BigNumber.from(10).pow(18)),
                tokensOwed0 =  0,
                tokensOwed1 =  0,
                owner.address,
                1669999614]
           )

           POOL1 = await uniswapv3factory.getPool(token1.address,token2.address,3000);
           //UNISWAPV3POOL = await ethers.getContractFactory("UniswapV3Pool");
          // UniswapV3Pool = await UNISWAPV3POOL.attach(GetPairAddress);


           const rreserve0 = await token1.balanceOf( POOL1);
           console.log("beforerreserve0 +=============================",rreserve0 );
           const rreserve1 = await token2.balanceOf( POOL1);
           console.log("beforereserve1+=============================",rreserve1);

           const beforereward = await token2.balanceOf( owner.address);
           console.log("\nbeforereward==========================================================",beforereward);



         console.log("\n========================= Multihop Swap==================================== ");

        // token3 0x68B1D87F95878fE05B998F19b66F4baba5De1aed


         await token2.approve(nonfungiblePositionManager.address,BigNumber.from("50").mul(BigNumber.from(10).pow(18)));
         await token3.approve(nonfungiblePositionManager.address,BigNumber.from("50").mul(BigNumber.from(10).pow(18)));
          


         await nonfungiblePositionManager.createAndInitializePoolIfNecessary(token3.address,token2.address,3000,79228162514264337593543950336n)


         await nonfungiblePositionManager.mint(
            [   token3.address,
                token2.address,         
                fee = 3000,
                tickLower = -600000,
                tickUpper = 600000,
                feeGrowthInside0LastX128 =  BigNumber.from("10").mul(BigNumber.from(10).pow(18)),
                feeGrowthInside1LastX128 =  BigNumber.from("10").mul(BigNumber.from(10).pow(18)),
                tokensOwed0 =  0,
                tokensOwed1 =  0,
                owner.address,
                1669999614]
           )

           POOL2 = await uniswapv3factory.getPool(token3.address,token2.address,3000);
        //    UNISWAPV3POOL = await ethers.getContractFactory("UniswapV3Pool");
        //    UniswapV3Pool = await UNISWAPV3POOL.attach(GetPairAddress);


           const Reserve0 = await token2.balanceOf( POOL2);
           console.log("beforerReserve0 +=============================",Reserve0 );
           const Reserve1 = await token3.balanceOf( POOL2);
           console.log("beforeReserve1+=============================",Reserve1);

           const beforereward1 = await token2.balanceOf( owner.address);
           console.log("\nbeforereward==========================================================",beforereward1);


           await token1.approve(swaprouter.address, 200000000000000000n);
           await token2.approve(swaprouter.address, 200000000000000000n);
           await token3.approve(swaprouter.address, 200000000000000000n);


           const Rreserve0 = await token1.balanceOf( POOL1);
           console.log("beforerreserve0 +=============================",Rreserve0 );
           const Rreserve1 = await token2.balanceOf( POOL1);
           console.log("beforereserve1+=============================",Rreserve1);

           const _Reserve0 = await token2.balanceOf( POOL2);
           console.log("beforerReserve0 +=============================",_Reserve0 );
           const _Reserve1 = await token3.balanceOf( POOL2);
           console.log("beforeReserve1+=============================",_Reserve1);




                       
           await swaprouter.exactInput( 
               
      
            
          

            
            
           [
            path = ethers.utils.solidityPack(["address", "uint24", "address", "uint24","address" ], [token3.address, 3000,token2.address,3000,token1.address]),
            

            //ethers.utils.arrayify(token1,3000,token2,3000,token3),
           
            recipient = owner.address,
            deadline = 1669999614,
            amountIn = 200000000000000000n,
            amountOutMinimum = 0
            ]           
           );


           const RReserve0 = await token1.balanceOf( POOL1);
           console.log("after reserve0 +=============================",RReserve0 );
           const RReserve1 = await token2.balanceOf( POOL1);
           console.log("after reserve1+=============================",RReserve1);

           const R_Reserve0 = await token2.balanceOf( POOL2);
           console.log("after Reserve0 +=============================",R_Reserve0 );
           const R_Reserve1 = await token3.balanceOf( POOL2);
           console.log("after Reserve1+=============================",R_Reserve1);

          // console.log("path========================================",path);

            //   const reserve0 = await token1.balanceOf( UniswapV3Pool.address);
            //   console.log("afterreserve0 +=============================",reserve0 );
            //   const reserve1 = await token2.balanceOf( UniswapV3Pool.address);
            //   console.log("afterreserve1+=============================",reserve1);

            //   const afterreward = await token2.balanceOf( owner.address);
            //   console.log("afterreward==========================================================",afterreward);


       


    })

    it("ExactOutputparam",async()=>{


        GETINIT = await ethers.getContractFactory("CalHash");
        getinit = await GETINIT.deploy();
        hash = await getinit.getInitHash();
       //console.log("hash++++++++++",hash);
       //console.log(token1.address, token2.address);


        const bal = await token1.balanceOf(owner.address);
        //console.log("bal+++++++++++++",bal);

        await token1.approve(nonfungiblePositionManager.address,BigNumber.from("50").mul(BigNumber.from(10).pow(18)));  
        const allowance =  await token1.allowance(owner.address,nonfungiblePositionManager.address);
        //console.log("allowance==================",allowance);

        await token2.approve(nonfungiblePositionManager.address,BigNumber.from("50").mul(BigNumber.from(10).pow(18)));
        const baloff =  await token2.balanceOf(owner.address);
        console.log("baloff+=================",baloff);




     

        await nonfungiblePositionManager.createAndInitializePoolIfNecessary(token1.address,token2.address,3000,79228162514264337593543950336n)

      
        await nonfungiblePositionManager.mint(
            [   token1.address,
                token2.address,         
                fee = 3000,
                tickLower = -600000,
                tickUpper = 600000,
                feeGrowthInside0LastX128 =  BigNumber.from("10").mul(BigNumber.from(10).pow(18)),
                feeGrowthInside1LastX128 =  BigNumber.from("10").mul(BigNumber.from(10).pow(18)),
                tokensOwed0 =  0,
                tokensOwed1 =  0,
                owner.address,
                1669999614]
           )

           POOL1 = await uniswapv3factory.getPool(token1.address,token2.address,3000);
           //UNISWAPV3POOL = await ethers.getContractFactory("UniswapV3Pool");
          // UniswapV3Pool = await UNISWAPV3POOL.attach(GetPairAddress);


           const rreserve0 = await token1.balanceOf( POOL1);
           console.log("beforerreserve0 +=============================",rreserve0 );
           const rreserve1 = await token2.balanceOf( POOL1);
           console.log("beforereserve1+=============================",rreserve1);

           const beforereward = await token2.balanceOf( owner.address);
           console.log("\nbeforereward==========================================================",beforereward);



         console.log("\n Multihop Swap======================================================================================================= ");

        // token3 0x68B1D87F95878fE05B998F19b66F4baba5De1aed


         await token2.approve(nonfungiblePositionManager.address,BigNumber.from("50").mul(BigNumber.from(10).pow(18)));
         await token3.approve(nonfungiblePositionManager.address,BigNumber.from("50").mul(BigNumber.from(10).pow(18)));
          


         await nonfungiblePositionManager.createAndInitializePoolIfNecessary(token3.address,token2.address,3000,79228162514264337593543950336n)


         await nonfungiblePositionManager.mint(
            [   token3.address,
                token2.address,         
                fee = 3000,
                tickLower = -600000,
                tickUpper = 600000,
                feeGrowthInside0LastX128 =  BigNumber.from("10").mul(BigNumber.from(10).pow(18)),
                feeGrowthInside1LastX128 =  BigNumber.from("10").mul(BigNumber.from(10).pow(18)),
                tokensOwed0 =  0,
                tokensOwed1 =  0,
                owner.address,
                1669999614]
           )

           POOL2 = await uniswapv3factory.getPool(token3.address,token2.address,3000);
        //    UNISWAPV3POOL = await ethers.getContractFactory("UniswapV3Pool");
        //    UniswapV3Pool = await UNISWAPV3POOL.attach(GetPairAddress);


           const Reserve0 = await token2.balanceOf( POOL2);
           console.log("beforerReserve0 +=============================",Reserve0 );
           const Reserve1 = await token3.balanceOf( POOL2);
           console.log("beforeReserve1+=============================",Reserve1);

           const beforereward1 = await token2.balanceOf( owner.address);
           console.log("\nbeforereward==========================================================",beforereward1);


           await token1.approve(swaprouter.address, 300000000000000000n);
           await token2.approve(swaprouter.address, 300000000000000000n);
           await token3.approve(swaprouter.address, 300000000000000000n);


           const Rreserve0 = await token1.balanceOf( POOL1);
           console.log("beforerreserve0 +=============================",Rreserve0 );
           const Rreserve1 = await token2.balanceOf( POOL1);
           console.log("beforereserve1+=============================",Rreserve1);

           const _Reserve0 = await token2.balanceOf( POOL2);
           console.log("beforerReserve0 +=============================",_Reserve0 );
           const _Reserve1 = await token3.balanceOf( POOL2);
           console.log("beforeReserve1+=============================",_Reserve1);


                       
           await swaprouter.exactOutput( 
               
      
            
          

            
            
           [
            path = ethers.utils.solidityPack(["address", "uint24", "address", "uint24","address" ], [token3.address, 3000,token2.address,3000,token1.address]),
            

            //ethers.utils.arrayify(token1,3000,token2,3000,token3),
           
            recipient = owner.address,
            deadline = 1669999614,
            amountOut = 200000000000000000n,
            amountInMaximum = 300000000000000000n
            ]           
           );


           const RReserve0 = await token1.balanceOf( POOL1);
           console.log("\nafter reserve0 +=============================",RReserve0 );
           const RReserve1 = await token2.balanceOf( POOL1);
           console.log("after reserve1+=============================",RReserve1);

           const R_Reserve0 = await token2.balanceOf( POOL2);
           console.log("after Reserve0 +=============================",R_Reserve0 );
           const R_Reserve1 = await token3.balanceOf( POOL2);
           console.log("after Reserve1+=============================",R_Reserve1);



        })  



})








