import {Upload,
    BrowserRouter as Router,
    Link,
  } from "react-router-dom";

export default function ReducTile (data) {
    const urlFinal = {
        pathname:"/shop/item/" + data.data.tokenId
    }
    return (
        <div className="card" style={{width: '18rem'}}>
            <div className="card-body">
                <h5 className="card-title">Carte de réduction</h5>
                <p className="card-text"><strong>{data.data.meta.reduction}</strong> % de reduction</p>
                {data.moreInfo === true ? <Link to={urlFinal} className="btn btn-primary">Plus d'information</Link> : null}
            </div>
        </div>
    )
}

