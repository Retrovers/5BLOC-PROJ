import Navbar from "./Navbar";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../lib/Pinita";
import NFTRailRoadShop from '../contracts/NFTRailRoadShop.json';
import {Modal} from 'bootstrap/dist/js/bootstrap.js';

const ethers = require("ethers");

export default function Admin () {

    const addr = '';

    function showLoadingModal() {
        const modal = new Modal(document.getElementById('loadingModal'), {});
        modal.show();
    }

    async function addPrivilegesCard(event) {
        event.preventDefault();
        showLoadingModal();

        const target = event.currentTarget;
        let data = [];

        Array.from(target.getElementsByTagName('input')).forEach(element => {
            if (element.type === 'submit') return;
            data[element.name] = element.value;    
        });

        Array.from(target.getElementsByTagName('select')).forEach(element => {
            data[element.name] = element.options[element.selectedIndex].value;
        });
        
        const nftJSON = {
            reduction: data.reduction,
            price: data.price, 
            type: 'REDUC',
        }

        const metadataURL = await new Promise(async (resolve) => {
            const response = await uploadJSONToIPFS(nftJSON);
            if(response.success === true){
                console.log("Uploaded JSON to Pinata: ", response)
                resolve(response.pinataURL);
            }
        });

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            let contract = new ethers.Contract(NFTRailRoadShop.address, NFTRailRoadShop.abi, signer);

            const price = ethers.utils.parseUnits(data.price, 'ether');
            let listingPrice = await contract.getListPrice();
            listingPrice = listingPrice.toString();

            let transaction = await contract.createToken(metadataURL, price, { value: listingPrice });
            await transaction.wait();

            alert("Votre carte de reduction a correctement été publié !");
            window.location.replace("/");
        }
        catch(e) {
            alert( "Upload error"+e );
        }
    }

    async function addTrajet(event) {
        event.preventDefault();
        showLoadingModal();
        
        const target = event.currentTarget;
        let data = [];

        Array.from(target.getElementsByTagName('input')).forEach(element => {
            if (element.type === 'submit' || element.type === 'file') return;
            data[element.name] = element.value;    
        });

        Array.from(target.getElementsByTagName('select')).forEach(element => {
            console.log(element)
            data[element.name] = element.options[element.selectedIndex].value;
        });

        const file = target.querySelector('input[type="file"]').files[0];

        const uploadFileDataUrl = await new Promise( async (resolve) => {
            const response = await uploadFileToIPFS(file);
            if(response.success === true) {
                console.log("Uploaded image to Pinata: ", response.pinataURL)
                resolve(response.pinataURL);
            }
        });

        const nftJSON = {
            startLocation: data.startLocation,
            endLocation: data.endLocation, 
            price: data.price, 
            type: 'TRAJET',
            image: uploadFileDataUrl
        }

        const metadataURL = await new Promise(async (resolve) => {
            const response = await uploadJSONToIPFS(nftJSON);
            if(response.success === true){
                console.log("Uploaded JSON to Pinata: ", response)
                resolve(response.pinataURL);
            }
        });

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            let contract = new ethers.Contract(NFTRailRoadShop.address, NFTRailRoadShop.abi, signer);

            const price = ethers.utils.parseUnits(data.price, 'ether');
            let listingPrice = await contract.getListPrice();
            listingPrice = listingPrice.toString();

            let transaction = await contract.createToken(metadataURL, price, { value: listingPrice });
            await transaction.wait();

            alert("Votre trajet a correctement été publié !");
            window.location.replace("/");
        }
        catch(e) {
            alert( "Upload error"+e );
        }

    }   

    return (
        <div className="">
        <Navbar></Navbar>
        <main className="container pt-5">
                <h2 className="pb-4 border-bottom">Espace admnistration de la boutique RailRoad</h2>
                <div className="alert alert-info mt-4">Votre adresse {addr} est autorisée à ajouter des nouveaux produits dans la boutique</div>
                <div className="accordion pt-2" id="accordionData">
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingOne">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                Ajouter une carte de réduction
                            </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionData">
                            <div className="accordion-body">
                                <form action="" onSubmit={addPrivilegesCard}>
                                <div className="mb-3">
                                    <label className="form-label">Selectionnez le pourcentage de réduction</label>
                                    <select className="form-select" name="reduction" aria-label="Default select example">
                                        <option value="10">Reduction de 10%</option>
                                        <option value="25">Reduction de 25%</option>
                                        <option value="50">Reduction de 50%</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Prix d'achat</label>
                                    <input className="form-control" type="text" name="price" placeholder="0.01"/>
                                </div>
                                <div className="mb-3">
                                    <input type="submit" className="btn btn-info text-white" value="Publier la nouvelle carte de réduction" />
                                </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className="accordion pt-4" id="accordionData1">
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingOne">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseOne">
                                Ajouter un nouveau trajet
                            </button>
                        </h2>
                        <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionData1">
                            <div className="accordion-body">
                                <form action="" onSubmit={addTrajet}>
                                    <div className="mb-3">
                                    <label className="form-label">Visuel de la destination</label>
                                        <input type="file" name="file" className="form-control"/>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Gare de depart</label>
                                        <input type="text" name="startLocation" className="form-control"/>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Gare d'arrivée</label>
                                        <input type="text" name="endLocation" className="form-control"/>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Prix d'achat (sans reduction)</label>
                                        <input className="form-control" name="price" type="text" placeholder="0.01"/>
                                    </div>
                                    <div className="mb-3">
                                        <input type="submit" className="btn btn-info text-white" value="Publier le noiveau trajet" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
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