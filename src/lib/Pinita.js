//require('dotenv').config();
const key = "950ceb0a6b6bbe0fdf7b";
const secret = "2c29f47f0bb6e31fa32c1fd74a0cb29c427abe496c02a85bbc25f60cdc5066bc";

const FormData = require('form-data');

export const uploadJSONToIPFS = async (JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    //making axios POST request to Pinata ⬇️
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            },
            body: JSON.stringify(JSONBody)
        })
            .then(res => res.json())
            .then(function (response) {
                resolve({
                    success: true,
                    pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.IpfsHash
                });
            })
            .catch(function (error) {
                console.log(error)
                reject({
                    success: false,
                    message: error.message,
                });
            });
    });
};

export const uploadFileToIPFS = async (file) => {
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    //making axios POST request to Pinata ⬇️

    let form_data = new FormData();
    form_data.append('file', file);

    const metadata = JSON.stringify({
        name: 'testname',
        keyvalues: {
            exampleKey: 'exampleValue'
        }
    });
    form_data.append('pinataMetadata', metadata);

    //pinataOptions are optional
    const pinataOptions = JSON.stringify({
        cidVersion: 0,
        customPinPolicy: {
            regions: [
                {
                    id: 'FRA1',
                    desiredReplicationCount: 1
                },
                {
                    id: 'NYC1',
                    desiredReplicationCount: 2
                }
            ]
        }
    });

    form_data.append('pinataOptions', pinataOptions);

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            maxBodyLength: 'Infinity',
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret,
                path: 'somaname'
            },
            body: form_data
        })
            .then(res => res.json())
            .then(function (response) {
                console.log(response)
                console.log("image uploaded", response.IpfsHash)
                resolve({
                    success: true,
                    pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.IpfsHash
                });
            })
            .catch(function (error) {
                console.log(error)
                reject({
                    success: false,
                    message: error.message,
                });

            });
    });
};