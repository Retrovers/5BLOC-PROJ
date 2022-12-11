import Navbar from "./Navbar";
import NFTRailRoadShopJSON from "../contracts/NFTRailRoadShop.json";
import ContractAddressJSON from "../contracts/contract-address.json";
import TokenJSON from "../contracts/Token.json";
import TrajetTile from "./subs/TrajetTile";
import React from 'react';
import ReducTile from "./subs/ReducTile";
const ethers = require("ethers");
export default class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.initialState = {
            data: [],
            dataFetched: false,
            address: '0x',
            balance: 0,
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
        this.getBalance();
        if(!this.state.dataFetched) {
            this.getNFTData('');
        }
    }

    async getBalance() {
        const token = new ethers.Contract(
            ContractAddressJSON.Token,
            TokenJSON.abi,
            this.state.provider.getSigner(0)
          );
          const balance = await token.balanceOf(this.state.address);
          this.setState({
            balance: balance
          });
    } 

    async getNFTData(tokenId) {
        let contract = new ethers.Contract(NFTRailRoadShopJSON.address, NFTRailRoadShopJSON.abi, this.state.signer);
        let transaction = await contract.getMyNFTs();
        const items = await Promise.all(transaction.map(async i => {
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
        <div className="profileClass">
            <Navbar></Navbar>
            <main className="container pt-5">
                <h2 className="pb-4 border-bottom">Retrouvez ici toutes les informations sur votre compte</h2>
                <div className="accordion pt-3" id="accordionData">
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingOne">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                Données de votre wallet
                            </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionData">
                            <div className="accordion-body">
                                <p>
                                    <strong>Adresse de votre wallet</strong>
                                    <input type="text" className="form-control" readOnly='readonly' value={this.state.address}/>
                                </p>
                                <p>
                                    <strong>Argent présent dans votre wallet </strong>
                                    <input type="text" className="form-control" readOnly='readonly' value={this.state.balance} />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pt-4">
                <h4 className="font-bold">Vos achats ({this.state.data.length}) : </h4>
                <div className="flex justify-center flex-wrap max-w-screen-xl">
                    <div className="mt-4">
                    <h6>Vos cartes de fidélitées : </h6>
                    {this.getReducCard().map((value, index) => {
                    return <ReducTile data={value} key={index}></ReducTile>;
                    })}
                    </div>
                    <div className="mt-4">
                    <h6>Vos billets : </h6>
                    {this.getTrajetCard().map((value, index) => {
                    return <TrajetTile data={value} key={index}></TrajetTile>;
                    })}
                    </div>
                </div>
                <div className="mt-10 text-xl">
                    {this.state.data.length == 0 ? "Vous n'avez pas encore éffectué d'achat":""}
                </div>
            </div>
            </main>
        </div>
    )
   }
    
}