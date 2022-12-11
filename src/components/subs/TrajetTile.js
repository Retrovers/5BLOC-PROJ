import {
    Upload,
    BrowserRouter as Router,
    Link,
} from "react-router-dom";

export default function TrajetTile(data) {
    const urlFinal = {
        pathname: "/shop/item/" + data.data.tokenId
    }
    return (
        <div className="card" style={{ width: '18rem' }}>
            <img src={data.data.meta.image} className="card-img-top" alt="..." />
            <div className="card-body">
                <h5 className="card-title">Votre billet</h5>
                <p className="card-text"><strong>{data.data.meta.startLocation}</strong> vers <strong>{data.data.meta.endLocation}</strong></p>
                {data.moreInfo === true ? <Link to={urlFinal} className="btn btn-primary">Plus d'information</Link> : null}
            </div>
        </div>
    )
}

