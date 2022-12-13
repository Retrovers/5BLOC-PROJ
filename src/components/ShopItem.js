import Navbar from "./Navbar";
import NFTRailRoadShop from "../contracts/NFTRailRoadShop.json";
import React from "react";
import {Modal} from 'bootstrap/dist/js/bootstrap.js';

const ethers = require("ethers");

export default class ShopItem extends React.Component {

    constructor(props) {
        super(props);

        this.initialState = {
            data: [],
            dataFetched: false,
            address: '0x',
            provider: null,
            signer: null,
            tokenId: null
        };
        this.state = this.initialState;
    }

    componentDidMount() {
        this.initialize();
    }

    showLoadingModal() {
        const modal = new Modal(document.getElementById('loadingModal'), {});
        modal.show();
    }

    async initialize() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const addr = await signer.getAddress();
        const params = window.location.pathname.split('/');
        const tokenId = params[params.length - 1];
        this.setState({
            address: addr,
            provider: provider,
            signer: signer,
            tokenId: tokenId
        }, this.getValues);

    }

    getValues() {
        if (!this.state.dataFetched)
            this.getNFTData(this.state.tokenId);
    }

    async getNFTData(tokenId) {
        let contract = new ethers.Contract(NFTRailRoadShop.address, NFTRailRoadShop.abi, this.state.signer);
        const tokenURI = await contract.tokenURI(tokenId);
        const listedToken = await contract.getListedTokenForId(tokenId);
        let meta = await new Promise((resolve) => fetch(tokenURI).then(res => res.json()).then(res => resolve(res)));
        let item = {
            price: meta.price,
            tokenId: tokenId,
            seller: listedToken.seller,
            owner: listedToken.owner,
            meta: meta
        }
        this.setState({
            data: item,
            dataFetched: true
        });
    }

    async buyNFT() {
        this.showLoadingModal();
        try {
            let contract = new ethers.Contract(NFTRailRoadShop.address, NFTRailRoadShop.abi, this.state.signer);
            const salePrice = ethers.utils.parseUnits(this.state.data.meta.price, 'ether');
            let transaction = await contract.executeSale(this.state.data.tokenId, { value: salePrice });
            await transaction.wait();
            alert('Vous avez acheté le produit');
            window.location.replace("/");
        }
        catch (e) {
            alert("buy error : " + e)
        }
    }

    render() {
        return (
            <div>
                <Navbar></Navbar>
                <main className="container pt-5">
                    <h2 className="pb-4 border-bottom">Information sur un produit de la boutique</h2>
                    {this.state.dataFetched === false ? <p>Chargement en cours...</p> : <div className="pt-4">
                    {this.state.data.meta.type === 'REDUC' ? 
                    <div className="card mb-3" style={{maxWidth: '540px'}}>
                            <div className="row g-0">
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h5 className="card-title">Carte de réduction</h5>
                                        <p className="card-text">En achetant cette carte, vous aurez {this.state.data.meta.reduction} de pourcentage de reduction pendant vos prochains achats</p>
                                        <p className="card-text"><small className="text-muted">Prix (sans réduction) : <strong>{this.state.data.meta.price}</strong></small></p>
                                    </div>
                                </div>
                            </div>
                        </div> 
                        :
                        <div className="card mb-3" style={{maxWidth: '540px'}}>
                            <div className="row g-0">
                                <div className="col-md-4">
                                    <img src={this.state.data.meta.image} className="img-fluid rounded-start" alt="..." />
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h5 className="card-title">Billet pour un trajet</h5>
                                        <p className="card-text">Trajet <strong>{this.state.data.meta.startLocation}</strong> vers <strong>{this.state.data.meta.endLocation}</strong></p>
                                        <p className="card-text"><small className="text-muted">Prix (sans réduction) : <strong>{this.state.data.meta.price}</strong></small></p>
                                    </div>
                                </div>
                            </div>
                        </div>}
                        <button className="btn btn-primary" onClick={this.buyNFT.bind(this)}>Acheter le produit</button>
                    </div>
                    }
                </main>
                <div className="modal fade" id="loadingModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                    <div className="modal-body">
                        <strong>Chargement en cours...</strong>
                    </div>
                    </div>
                </div>
            </div>
            </div>
        )
    }

}