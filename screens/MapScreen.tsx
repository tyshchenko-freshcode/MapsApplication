import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MapView, {Callout, Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCompass,
  faMapMarkerAlt,
  faSatellite,
} from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-native-modal';

const icon1 = require('../assets/MarkerIcons/1.png');
const icon2 = require('../assets/MarkerIcons/2.png');
const icon3 = require('../assets/MarkerIcons/3.png');

const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = 0.02;

interface IGeolocation {
  latitude: number;
  longitude: number;
}

interface IMarkers {
  workType: string;
  coords: IGeolocation;
  iconSrc: string;
  title: string;
  description: string;
}

const MapScreen: React.FC = () => {
  const [customMarker, setCustomMarker] = useState<IMarkers | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [mapType, setMapType] = useState<string>('standard');
  const map = useRef<MapView>(null);
  const markerRef = useRef<Marker | null>(null);
  const modalRef = useRef();

  const [currentPosition, setCurrentPosition] = useState<IGeolocation>({
    latitude: 37.78825,
    longitude: -122.4324,
  });

  const markers: Array<IMarkers> = [
    {
      workType: 'pending',
      coords: {
        latitude: 37.78825,
        longitude: -122.4324,
      },
      iconSrc: icon1,
      title: 'Pending icon title',
      description: 'Pending icon description',
    },
    {
      workType: 'in_progress',
      coords: {
        latitude: 27.41907,
        longitude: 83.30663,
      },
      iconSrc: icon2,
      title: 'In progress icon title',
      description: 'In progress icon description',
    },
    {
      workType: 'done',
      coords: {
        latitude: 35.00233,
        longitude: -105.30102,
      },
      iconSrc: icon3,
      title: 'Done icon title',
      description: 'Done icon description',
    },
  ];

  useEffect(() => {
    if (customMarker) {
      markers.forEach(marker => {
        if (marker.workType === customMarker.workType) {
          zoomToCoordinates(marker.coords);
          markerRef.current.hideCallout();
        }
      });
    }
  }, [customMarker]);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrentPosition({
          latitude,
          longitude,
        });
      },
      error => alert(JSON.stringify(error)),
      {enableHighAccuracy: false, timeout: 20000},
    );
  }, []);

  const zoomToCoordinates = useCallback((coords: IGeolocation) => {
    map.current.animateToRegion({
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  }, []);

  const zoomToCurrent = useCallback(() => {
    zoomToCoordinates(currentPosition);
  }, [currentPosition]);

  const switchMarker = useCallback(() => {
    setCustomMarker(markers[Math.floor(Math.random() * markers.length)]);
  }, []);

  const showDetails = useCallback(() => {
    setModalVisible(true);
  }, []);

  const hideDetails = useCallback(() => {
    setModalVisible(false);
    modalRef.current.close();
  }, []);

  const switchMapType = useCallback(() => {
    if (mapType === 'standard') {
      setMapType('satellite');
      return;
    }
    setMapType('standard');
  }, [mapType]);

  return (
    <View style={styles.container}>
      <MapView
        mapType={mapType}
        ref={map}
        style={styles.map}
        initialRegion={{
          latitude: currentPosition.latitude,
          longitude: currentPosition.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}>
        <Marker
          coordinate={{
            latitude: currentPosition.latitude,
            longitude: currentPosition.longitude,
          }}
          title="You are here"
          description="Your current position"
        />
        {customMarker ? (
          <Marker
            ref={markerRef}
            coordinate={{
              latitude: customMarker.coords.latitude,
              longitude: customMarker.coords.longitude,
            }}
            onCalloutPress={() => {
              setModalVisible(true);
              markerRef.current.hideCallout();
            }}
            icon={customMarker.iconSrc}>
            <Callout tooltip>
              <View style={styles.callout}>
                <Text style={styles.calloutHeader}>Marker title: </Text>
                <Text style={styles.calloutText}>{customMarker.title}</Text>
                <Text style={styles.calloutHeader}>Marker description: </Text>
                <Text style={styles.calloutText}>
                  {customMarker.description}
                </Text>
                <View style={styles.popupFooter}>
                  <Text style={styles.imageContainer}>
                    <Image
                      resizeMode="cover"
                      style={styles.calloutImage}
                      source={customMarker.iconSrc}
                    />
                  </Text>
                  <TouchableOpacity
                    style={styles.detailsBtn}
                    onPress={showDetails}>
                    <Text>Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.arrow} />
              <View style={styles.arrowBorder} />
            </Callout>
          </Marker>
        ) : null}
      </MapView>
      <TouchableOpacity onPress={zoomToCurrent} style={styles.locationBtn}>
        <FontAwesomeIcon icon={faCompass} style={styles.icon} size={30} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={switchMarker}
        style={[styles.locationBtn, styles.markerBtn]}>
        <FontAwesomeIcon icon={faMapMarkerAlt} style={styles.icon} size={30} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={switchMapType}
        style={[styles.locationBtn, styles.mapTypeBtn]}>
        <FontAwesomeIcon icon={faSatellite} style={styles.icon} size={30} />
      </TouchableOpacity>
      {customMarker ? (
        <Modal
          ref={modalRef}
          isVisible={modalVisible}
          style={styles.modal}
          hideModalContentWhileAnimating={true}
          onSwipeComplete={hideDetails}
          swipeDirection={'down'}>
          <View style={styles.modalContainer}>
            <View style={styles.topBar} />
            <View>
              <Text style={styles.calloutHeader}>Marker title: </Text>
              <Text style={styles.calloutText}>{customMarker.title}</Text>
              <Text style={styles.calloutHeader}>Marker description: </Text>
              <Text style={styles.calloutText}>{customMarker.description}</Text>
            </View>
            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={hideDetails}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  locationBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  markerBtn: {
    bottom: '90%',
  },
  mapTypeBtn: {
    bottom: '80%',
  },
  icon: {
    color: '#000',
  },
  callout: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 6,
    borderColor: '#ccc',
    borderWidth: 0.5,
    padding: 15,
    width: 250,
    height: 250,
  },
  calloutText: {
    fontSize: 16,
    marginBottom: 10,
    marginLeft: 15,
  },
  arrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#fff',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#ffffff',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -0.5,
  },
  calloutHeader: {
    fontSize: 24,
    fontWeight: '600',
  },
  calloutImage: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#000',
  },
  imageContainer: {
    height: 100,
    position: 'relative',
  },
  popupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  detailsBtn: {
    backgroundColor: '#28adff',
    padding: 10,
    borderRadius: 5,
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 50,
  },
  closeModalBtn: {
    backgroundColor: '#ccc',
    borderRadius: 20,
    width: '70%',
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  topBar: {
    width: '90%',
    height: 5,
    backgroundColor: '#b0b0b0',
  },
});

export default MapScreen;
