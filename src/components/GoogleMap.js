import React from "react";
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';


class MapContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    displayMarkers = () => {
        if (this.props.place === null) {
            return null;
        }
        return <Marker position={{
            lat: this.props.place.lat,
            lng: this.props.place.lng
        }}/>
    }

    render() {
        return (
            <Map
                google={this.props.google}
                zoom={15}
                style={this.props.style}
                initialCenter={{ lat: 38.537, lng: -121.754}}
            >
                {this.displayMarkers()}
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAROqzHhQRz5PPDTK1XWYpmDaIzL8p2M7g'
})(MapContainer);