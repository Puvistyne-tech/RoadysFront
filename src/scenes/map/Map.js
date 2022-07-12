import React, { useEffect, useState, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import {
 View, Text, Image, TouchableOpacity
} from 'react-native'
import MapView, { Marker, Circle } from 'react-native-maps'
import * as Location from 'expo-location'
import {
  useQuery, useMutation
} from "@apollo/client";
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'react-native-elements';

import Appstyles from '../../../assets/styles/main.scss';
import StickManImg from '../../../assets/images/man.png';
import CurrentUserStickMan from '../../../assets/images/current-stick-man.png';
import Loader from '../../components/Loader'

import { Button } from 'react-native-elements';

import { GET_USERS, UPDATE_LOCATION } from './queries'

const Map = () => {
  const [defautlLocation] = useState({
    latitude: 48.86,
    longitude: 2.34,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })

  const [location, setLocation] = useState({ coords: defautlLocation })
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState()
  const [isPressed, setIsPressed] = useState(false);
  const [idUserPressed, setIdUserPressed] = useState();
  const { theme } = useTheme();

  const  { data, refetch } = useQuery(GET_USERS, {variables: {excludeCurrentUser: true}});
  const [mutateUpdateLocation, { 
    data: updateLocationData, 
    loading: updateLocationLoading, 
    error: updateLocationError 
  }] = useMutation(UPDATE_LOCATION);

  const onLocationChange = useCallback((newLocation) => {
    const {longitude, latitude} = newLocation.coords
    refetch();
    setLocation(newLocation);
    mutateUpdateLocation({variables: {longitude, latitude}});
  }, [refetch])

  useEffect(() => {
    (async () => {
      setLoading(true)
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setLoading(false)
        setErrorMsg('Permission to access location was denied')
        return
      }
      setLoading(false)
      Location.watchPositionAsync({accuracy: 3, distanceInterval: 1, timeInterval: 1000}, onLocationChange)
    })()
  }, [refetch]);

  const MarkerCard = useCallback(({elem})=>{
    return (
      <View style={Appstyles.markerCardContainer}>
        <View style={Appstyles.markerCardTextContainer}>
          <Text style={Appstyles.title}>{elem.pseudo}</Text>
          <Text style={Appstyles.paragraph}>{elem.age}</Text>
          <Text style={Appstyles.paragraph}>{elem.nationality}</Text>
        </View>
        <Image style={Appstyles.marker} source={StickManImg}/>
      </View>
    );
  }, []);

  const MarkerActions = useCallback(()=>{
    const navigation = useNavigation();
    return (
      <View>
        <Button title="Voir le profil" onPress={() => navigation.navigate("USER_PROFIL_SCREEN", { id: idUserPressed})}/>
      </View>
    );
  }, [idUserPressed]);

  const CustomMarker =  useCallback(({elem})=>{ 
    return  (
      <Marker 
        coordinate={{latitude: elem.latitude, longitude: elem.longitude}}
        onPress={()=>{
          setIsPressed(!isPressed);
          setIdUserPressed(elem.id);
        }}
      >
      {isPressed && idUserPressed === elem.id ? <MarkerCard elem={elem} />: <Image style={Appstyles.userMarker} source={StickManImg}/>}
      </Marker>
    )
  }, [isPressed, idUserPressed]);

  const ListUsers = useMemo(()=>{
    return data?.users?.map((elem, index)=>{
      return <CustomMarker key={index} elem={elem} />
    })
  },[data, CustomMarker])


  const userMarker = useMemo(
    () => ({
      coordinate: {
        latitude: location?.coords.latitude,
        longitude: location?.coords.longitude,
      },
      title: 'Moi'
    }),
    [location],
  )
  if (errorMsg) {
    return (
      <View style={Appstyles.container}>
        <Text style={Appstyles.paragraph}>{errorMsg}</Text>
      </View>
    )
  }
  if (loading) {
    return (
      <Loader/>
    )
  }

  return (
    <View style={Appstyles.container}>  
      <View style={theme.ActionsContainer}>
        {isPressed && <MarkerActions/>}
      </View>
      <MapView style={Appstyles.map} initialRegion={defautlLocation}>
      <Circle center={userMarker.coordinate} radius={10} strokeWidth={0} strokeColor={'rgba(143,0,255,0.26)'} fillColor={'rgbargba(143,0,255,0.26)'}/>

        <Marker
          coordinate={userMarker.coordinate}
        >
          <Image style={Appstyles.currentUserMaker} source={CurrentUserStickMan} />
        </Marker>
        {ListUsers}
      </MapView>
    </View>
  )
}

Map.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
}

Map.defaultProps = {
  navigation: { navigate: () => null },
}

export default Map
