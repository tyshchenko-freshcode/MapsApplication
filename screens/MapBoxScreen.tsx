import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Geolocation from '@react-native-community/geolocation';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCompass, faMoon} from '@fortawesome/free-solid-svg-icons';
import Camera = MapboxGL.Camera;
import Modal from 'react-native-modal';

MapboxGL.setAccessToken(
  'pk.eyJ1Ijoic3R5c2hjaGVua28iLCJhIjoiY2t0b2JsaXRzMGJlZjJ3bzRsd3c5dzZiZSJ9.kzyor1fFmMreeKz-NIq9PA',
);

const MapBoxScreen = () => {
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();
  const cameraRef = useRef<Camera>(null);
  const modalRef = useRef();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [mapStyle, setMapStyle] = useState(MapboxGL.StyleURL.Street);
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());
  const [markersState, setMarkersState] = useState(null);

  const markers = [
    [35.137022, 47.836701],
    [35.107315, 47.850924],
    [35.141886, 47.878482],
    [35.1204, 47.803065],
  ];

  const hideDetails = useCallback(() => {
    setModalVisible(false);
    modalRef.current.close();
  }, []);

  const renderBlueMarker = useCallback(() => {
    return (
      <MapboxGL.PointAnnotation
        onDeselected={() => {
          setModalVisible(true);
        }}
        key={'pointAnnotation'}
        id={'pointAnnotation'}
        coordinate={[35.137022, 47.836701]}
        title={''}>
        <View style={styles.blueMarker} />
        <MapboxGL.Callout title={''}>
          <View
            style={{
              width: 150,
              height: 150,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 5,
            }}>
            <Text>Text</Text>
            <TouchableOpacity style={styles.detailsBtn}>
              <Text>Details</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.arrow} />
        </MapboxGL.Callout>
      </MapboxGL.PointAnnotation>
    );
  }, []);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLat(latitude);
        setLon(longitude);
      },
      error => alert(JSON.stringify(error)),
      {enableHighAccuracy: false, timeout: 20000},
    );
    renderMarkers();
  }, []);

  const zoomToCurrentPosition = useCallback(() => {
    cameraRef.current.setCamera({
      centerCoordinate: [lon, lat],
      zoomLevel: 15,
      animationDuration: 2000,
    });
  }, [lon, lat]);

  const changeMapStyle = useCallback(() => {
    let newStyle = null;
    if (mapStyle === MapboxGL.StyleURL.Street) {
      newStyle = 'mapbox://styles/salsh/ck7b2f6jv0d3l1jp8x9shbpmo';
    } else {
      newStyle = MapboxGL.StyleURL.Street;
    }
    setMapStyle(newStyle);
    renderMarkers();
  }, [mapStyle]);

  const showModal = useCallback(() => {
    setModalVisible(true);
  }, [modalVisible]);

  const renderMarkers = useCallback(() => {
    setCurrentTimestamp(Date.now());
    const markersArray = markers.map((marker, index) => {
      return (
        <MapboxGL.PointAnnotation
          onDeselected={showModal}
          key={index + '_' + currentTimestamp}
          id={index + '_' + currentTimestamp}
          coordinate={[marker[0], marker[1]]}
          title={''}>
          <View style={styles.blueMarker} />
          <MapboxGL.Callout title={''}>
            <View style={styles.popupBody}>
              <Text>{index}</Text>
              <TouchableOpacity style={styles.detailsBtn}>
                <Text>Details</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.arrow} />
          </MapboxGL.Callout>
        </MapboxGL.PointAnnotation>
      );
    });
    setMarkersState(markersArray);
  }, [mapStyle, currentTimestamp]);

  return (
    <View style={styles.main}>
      <MapboxGL.MapView
        styleURL={mapStyle}
        style={styles.map}
        attributionEnabled={false}
        logoEnabled={false}>
        <MapboxGL.Camera ref={cameraRef} />
        <MapboxGL.UserLocation />
        {markersState}

        {/*<MapboxGL.PointAnnotation*/}
        {/*  onDeselected={showModal}*/}
        {/*  key={'point' + currentTimestamp}*/}
        {/*  id={'point' + currentTimestamp}*/}
        {/*  coordinate={[35.137022, 47.836701]}*/}
        {/*  title={''}>*/}
        {/*  <View style={styles.blueMarker} />*/}
        {/*  <MapboxGL.Callout title={''}>*/}
        {/*    <View style={styles.popupBody}>*/}
        {/*      <Text>Text</Text>*/}
        {/*      <TouchableOpacity style={styles.detailsBtn}>*/}
        {/*        <Text>Details</Text>*/}
        {/*      </TouchableOpacity>*/}
        {/*    </View>*/}
        {/*    <View style={styles.arrow} />*/}
        {/*  </MapboxGL.Callout>*/}
        {/*</MapboxGL.PointAnnotation>*/}
      </MapboxGL.MapView>
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
            <Text style={styles.calloutHeader}>Marker description: </Text>
          </View>
          <TouchableOpacity style={styles.closeModalBtn} onPress={hideDetails}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={zoomToCurrentPosition}
        style={styles.locationBtn}>
        <FontAwesomeIcon icon={faCompass} style={styles.icon} size={30} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={changeMapStyle}
        style={[styles.locationBtn, styles.styleBtn]}>
        <FontAwesomeIcon icon={faMoon} style={styles.icon} size={30} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
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
  styleBtn: {
    bottom: 90,
  },
  blueMarker: {
    height: 30,
    width: 30,
    backgroundColor: '#00cccc',
    borderRadius: 50,
    borderColor: '#fff',
    borderWidth: 3,
  },
  detailsBtn: {
    backgroundColor: '#28adff',
    padding: 10,
    borderRadius: 5,
  },
  arrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#ffffff',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -0.5,
    marginBottom: -10,
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
  popupBody: {
    width: 150,
    height: 150,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});

export default MapBoxScreen;
