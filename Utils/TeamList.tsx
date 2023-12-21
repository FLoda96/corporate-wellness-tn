// TeamList.js

import React, {useContext, useEffect, useState, useRef} from 'react';
import { FlatList, View, Text, Image, StyleSheet, ScrollView, Button } from 'react-native';
import {UserContext, UserContextType, LoginContext, LoginContextType, UserIdContext, UserIdContextType} from '../Utils/AuthContext'
import { ok, created, bad_request, no_content, GetRoutePerformanceByUser, Team, GetTeams, JoinTeam, LeaveTeam } from '../Utils/WebServerUtils';
import {showTeamAlreadyJoined, showNotPartOfTeam} from '../Utils/Alert'


interface TeamTableProps {
    teams: Team[];
    join: boolean;
    leave: boolean;
    refresh_function: Function;
  }

// TO DO : What if the images do not load ?
// TO DO : Where to store the images ?
export function TeamList({teams, join, leave, refresh_function}: TeamTableProps): JSX.Element {
  const JoinGroupButtonTitle = 'Join Group'
  const LeaveGroupButtonTitle = 'Leave Group'
  const {UserId, SetUserId} = useContext(UserIdContext) as UserIdContextType;

  async function JoinTeamButtonPress (team_id: number) {
    try {
        const response = await JoinTeam({user_id: UserId, team_id: team_id});
        if (response == created) {
            refresh_function();
        } else if (response == bad_request) {
            showTeamAlreadyJoined();
        }
    } catch (err) {
        console.log("something went wrong JoinTeamButtonPress");
      }
  }

  async function LeaveTeamButtonPress (team_id: number) {
    try {
        const response = await LeaveTeam({user_id: UserId, team_id: team_id});
        if (response == no_content) {
            refresh_function();
        } else if (response == bad_request) {
            showNotPartOfTeam();
        }
    } catch (err) {
        console.log("something went wrong JoinTeamButtonPress");
      }
  }


  const renderItem = ({ item }: { item: Team }) => (
    <ScrollView style={styles.teamContainer}>
      <View style={styles.teamInfo}>
        <Text style={styles.teamName}>{item.name}</Text>
        <Image style={styles.logo} source = {{uri : item.logo_link}} />
        <Text style={styles.description}>{item.description}</Text>
        {join && <Button title={JoinGroupButtonTitle} onPress={() => JoinTeamButtonPress(item.team_id)}/>}
        {leave && <Button title={LeaveGroupButtonTitle} onPress={() => LeaveTeamButtonPress(item.team_id)}/>}
      </View>
    </ScrollView>
  );

  return (
    <FlatList
      data={teams}
      keyExtractor={(item) => item.team_id.toString()}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  teamContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  logo: {
    width: 70,
    height: 70,
    marginRight: 16,
    borderRadius: 25,
  },
  teamInfo: {
  },
  teamName: {
    color : 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 4,
    color: '#555',
  },
});

export default TeamList;
