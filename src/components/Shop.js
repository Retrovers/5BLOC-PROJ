import Navbar from "./Navbar";
import ReducTile from "./subs/ReducTile";
import TrajetTile from "./subs/TrajetTile";
import NFTRailRoadShop from "../contracts/NFTRailRoadShop.json";
import React from "react";

const ethers = require("ethers");

export default class Shop extends React.Component {
    
    constructor(props) {
        super(props);

        this.initialState = {
            data: [],
            dataFetched: false,
            provider : null,
            signer: null
        };

        this.state = this.initialState;
    }
    
    componentDidMount() {
        this.initialize();
    }


    async initialize() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const addr = await signer.getAddress();
        this.setState({
            address: addr,
            provider: provider,
            signer: signer
        }, this.getValues);
        
    }

    getValues() {
        if(!this.state.dataFetched) {
            this.getAllNFTs();
        }
    }
    
    async getAllNFTs() {

        let contract = new ethers.Contract(NFTRailRoadShop.address, NFTRailRoadShop.abi, this.state.signer)
        //create an NFT Token
        let transaction = await contract.getAllNFTs()
        
        //Fetch all the details of every NFT from the contract and display
        const items = await Promise.all(transaction.map(async i => {
            console.log(i)
            const tokenURI = await contract.tokenURI(i.tokenId);
            let meta = await new Promise((resolve) => fetch(tokenURI).then(res => res.json()).then(res => resolve(res)));
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
            let item = {
                price,
                meta: meta,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
            }
            return item;
        }));
        
        this.setState({
            data: items,
            dataFetched: true
        });
    }
    
    getReducCard() {
        return this.state.data.filter(el => el.meta.type === 'REDUC');
    }

    getTrajetCard() {
        return this.state.data.filter(el => el.meta.type === 'TRAJET');
    }

    render() {
        return (
            <div>
            <Navbar></Navbar>
            <main className="container pt-5">
            <h2 className="pb-4 border-bottom">Retrouvez ici nos offres</h2>
            <div className="flex justify-center flex-wrap max-w-screen-xl">
                    <div className="mt-4">
                    <h6 className="mb-3">Cartes de fidélitées disponibles à l'achat : </h6>
                    {this.getReducCard().map((value, index) => {
                    return <ReducTile data={value} moreInfo={true} key={index}></ReducTile>;
                    })}
                    </div>
                    <div className="mt-5">
                    <h6 className="mb-3">Billet disponibles pour les trajets suivants : </h6>
                    {this.getTrajetCard().map((value, index) => {
                    return <TrajetTile data={value} moreInfo={true} key={index}></TrajetTile>;
                    })}
                    </div>
                </div>
                </main>
                </div>
            );
        }
    }