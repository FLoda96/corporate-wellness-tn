import React, {useContext, useEffect, useState} from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { ok, RoutePerformance, GetRoutes, Routes } from './WebServerUtils';
import { useTranslation } from 'react-i18next';


interface RoutePerformanceTableProps {
  data: RoutePerformance[];
}

export function RoutePerformanceTable({data}: RoutePerformanceTableProps): JSX.Element {
    const { t, i18n } = useTranslation();
    const [Routes, setRoutes] = useState<Routes[] | null>(null);

    const route = t('route_table.route');
    const time = t('route_table.time');
    const date = t('route_table.date');
    const heart_rate_start = t('route_table.heart_rate_start');
    const heart_rate_end = t('route_table.heart_rate_end');

    useEffect(() => {
        const fetchData = async () => {
          const response = await GetRoutes();
          if (response.response_code == ok && response.routes != null) {
            setRoutes(response.routes);
          }
        };
        // Roundabout way to call the above but async TO DO : search a library that does this
        fetchData();
      }, []);

  const renderRow = ({ item }: { item: RoutePerformance }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{lookupRouteName(item.route_id)}</Text>
      <Text style={styles.cell}>{formatTimeDifference(item.timestamp_start, item.timestamp_end)}</Text>
      <Text style={styles.cell}>{formatDate(item.timestamp_start)}</Text>
      <Text style={styles.cell}>{item.heart_rate_start}</Text>
      <Text style={styles.cell}>{item.heart_rate_end}</Text>
      {/* Add more columns as needed */}
    </View>
  );

  const formatTimeDifference = (start: string, end: string): string => {
    const timeDifferenceInSeconds = Math.floor((Date.parse(end) - Date.parse(start)) / 1000);
  
    const minutes = Math.floor(timeDifferenceInSeconds / 60);
    const seconds = timeDifferenceInSeconds % 60;
  
    return `${minutes}m ${seconds}s`;
  };

  // TO DO : Technically the go on next line should adapt to the screen, but we'll deal with that later
  const formatDate = (date: string ): string => {
    return date.substring(8,10)+'-'+date.substring(5,7)+'-'+'\n'+date.substring(0,4)
  }

  function lookupRouteName(RouteId: number): string {
    if (Routes != null) {
        for (let route of Routes) {
            if (RouteId == route.route_id)
                return route.name;
        }
    } else {
        return '##';
    }
    return '##';
  }
  

  return (
    <FlatList
      style={styles.list}
      data={data}
      keyExtractor={(item) => item.performance_id.toString()}
      renderItem={renderRow}
      ListHeaderComponent={() => (
        <View style={[styles.row, styles.header]}>
          <Text style={[styles.cell, styles.headerText]}>{route}</Text>
          <Text style={[styles.cell, styles.headerText]}>{time}</Text>
          <Text style={[styles.cell, styles.headerText]}>{date}</Text>
          <Text style={[styles.cell, styles.headerText]}>{heart_rate_start}</Text>
          <Text style={[styles.cell, styles.headerText]}>{heart_rate_end}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
    container: {
      margin: 10,
    },
    list: {
      height: '100%',
      width: '100%',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1, // Add a border to separate rows
      borderBottomColor: '#ccc', // Border color
    },
    cell: {
      flex: 1,
      padding: 5,
      color: 'black',
      textAlign: 'center',
    },
    header: {
      backgroundColor: '#f0f0f0', // Header background color
    },
    headerText: {
      fontWeight: 'bold', // Make header text bold
      textAlign: 'center', // Center the text in the header
    },
  });

export default RoutePerformanceTable;