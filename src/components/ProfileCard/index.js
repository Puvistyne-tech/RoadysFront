import React, { useEffect, useMemo } from 'react'
import {
  Text,
  View,
} from "react-native";
import { Card } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';


import {
  useQuery
} from "@apollo/client";
import {showMessage} from "react-native-flash-message";

import Appstyles from '../../../assets/styles/main.scss';
import { GET_USER } from './queries'
import Loader from '../../components/Loader';

const ProfileCard = ({id}) => {
  const  { data, refetch, error } = useQuery(GET_USER, {variables: {id: id}});
  const user = useMemo(()=> data?.user, [data])

  useEffect(()=>{
    error && showMessage({
      message: "Error",
      description: error.message,
      type: "danger",
      duration: 1000000
    });
  },[error]);
  
  useFocusEffect(
    React.useCallback(() => {
      refetch()
    }, [refetch])
  );

  return (
    <View style={Appstyles.container}>
      { user ?
        <Card>
          <Card.Title> { user?.firstname } {user?.lastname} </Card.Title>
          <Card.Divider />
          <View style={{ flexDirection: "row" }}>
            <Text style={Appstyles.loginText}>{user?.pseudo}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={Appstyles.loginText}>{user?.age}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={Appstyles.loginText}>{user?.kindOfTrip}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={Appstyles.loginText}>{user?.nationality}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={Appstyles.loginText}>{user?.description}</Text>
          </View>
        </Card>
      :
        <Loader/>
      }
    </View>
  );
}

export default ProfileCard;