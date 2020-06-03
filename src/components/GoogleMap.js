import React from "react";
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';


class MapContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    displayMarkers = () => {
        if (!this.props.place) {
            return null;
        }
        return <Marker position={{
            lat: this.props.place.lat,
            lng: this.props.place.lng
        }}/>
    }

    onClick = (t, mpa, coordinates) => {
        const { latLng } = coordinates;
        const lat = latLng.lat();
        const lng = latLng.lng();

        this.props.setMarker({
            lat: lat,
            lng: lng
        })
    }

    render() {
        return (
            <Map
                google={this.props.google}
                zoom={15}
                style={this.props.style}
                initialCenter={{ lat: 38.537, lng: -121.754}}
                onClick={this.onClick}
            >
                {this.displayMarkers()}
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAROqzHhQRz5PPDTK1XWYpmDaIzL8p2M7g'
})(MapContainer);