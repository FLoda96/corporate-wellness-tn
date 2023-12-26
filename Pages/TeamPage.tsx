import React, {useContext, useEffect, useState, useRef} from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import {TeamsPageScreenProps} from '../Utils/NavigationTypes'
import {UserContext, UserContextType, LoginContext, LoginContextType, UserIdContext, UserIdContextType} from '../Utils/AuthContext'
import {saveSessionData, removeSessionData} from '../Utils/EncryptedStorageUtility'
import { HandleLogin, sessionAuthName } from '../Utils/FunctionUtils';
import { ok, no_content, bad_request, GetRoutePerformanceByUser, Team, GetTeams, TeamMembers, GetTeamJoined } from '../Utils/WebServerUtils';
import { LoadingScreen } from '../Utils/LoadingScreen';
import { RoutePerformanceTable } from '../Utils/RoutePerformanceTable';
import { styles } from '../Utils/Styles'
import { TeamList } from '../Utils/TeamList'
import { useTranslation } from 'react-i18next';

// TO DO : Team Description in multilanguage
// TO DO : Make the reload button the classic refresh icon
// TO DO : How to make the table reload every time i return to the page
// TO DO : Move disconnect as a general function in the header or something
export function TeamPage({ navigation }: TeamsPageScreenProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [teamsOpen, setTeamsOpen] = useState<Team[] | null>(null);
  const [teamsJoined, setTeamsJoined] = useState<Team[] | null>(null);
  const {User, SetUser} = useContext(UserContext) as UserContextType;
  const {UserId, SetUserId} = useContext(UserIdContext) as UserIdContextType;
  const teams = useRef<Team[] | null>(null);
  const joinedTeams = useRef<TeamMembers[] | null>(null);
  const { t, i18n } = useTranslation();
  //  const sessionAuthName = 'user_auth'

  const reload_table = t('team_page.reload_table');
  const your_teams = t('team_page.your_teams');
  const other_teams = t('team_page.other_teams');

  useEffect(() => {
    const fetchData = async () => {
        LoadTeamTables();
    };
    // Roundabout way to call the above but async TO DO : search a library that does this
    fetchData();
  }, []);

  async function LoadTeamTables() {
    setIsLoading(true);
    await LoadTeams();
    setIsLoading(true);
    await LoadJoinedTeams();
    setIsLoading(true);
    DivideLists();
  }

  async function LoadTeams () {
    const response = await GetTeams();
    if (response.response_code == ok) {
      setIsLoading(false);
      teams.current = response.teams;
    } else {
      setIsLoading(false);
      console.log('Something went wrong LoadTeams')
    }
  }

  async function LoadJoinedTeams () {
    const response = await GetTeamJoined({user_id: UserId});
    if (response.response_code == ok || response.response_code == no_content) {
      setIsLoading(false);
      joinedTeams.current = response.team_members;
    } else {
      setIsLoading(false);
      console.log('Something went wrong LoadJoinedTeams')
    }
  }


  function DivideLists () {
    // Initialize to null to avoid members being added each time the function is called
    setTeamsOpen(null);
    setTeamsJoined(null);
    if (teams.current != null) {
        if (joinedTeams.current != null) {
            for (const team of teams.current) {
                var HasJoined = false;
                for (const joined of joinedTeams.current) {
                    if (team.team_id == joined.team_id) {
                        setTeamsJoined((teamsJoined) => [...(teamsJoined || []), team]);
                        HasJoined = true;
                    }
                }
                if (HasJoined == false) {
                    setTeamsOpen((teamsOpen) => [...(teamsOpen || []), team]);
                }   
            }    
        } else {
            setTeamsOpen(teams.current);
            setTeamsJoined(null);
        } 
    } else {
        setTeamsOpen(null);
        setTeamsJoined(null);
    }
    setIsLoading(false);
  }

    return (
        <View style={styles.navigation}>
            <View style={{marginBottom: 10}}></View>
            <Button title={reload_table} onPress={() => LoadTeamTables()} />

            {((teamsJoined != null) && (teamsJoined[0] != null)) && 
            <>
                <Text style={styles.headerTeam}>{your_teams}</Text>
                <TeamList teams={teamsJoined} join={false} leave={true} refresh_function={LoadTeamTables}></TeamList>
            </>
            }
            {isLoading && <LoadingScreen/>}
            {((teamsOpen != null) && (teamsOpen[0] != null)) &&
            <>
                <Text style={styles.headerTeam}>{other_teams}</Text>
                <TeamList teams={teamsOpen} join={true} leave={false} refresh_function={LoadTeamTables}></TeamList>
            </>
            }
            
      </View>
    );
  };
  
  export default TeamPage;