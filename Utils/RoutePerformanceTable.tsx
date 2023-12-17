import React, {useContext, useEffect, useState} from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { ok, RoutePerformance, GetRoutes, Routes } from './WebServerUtils';

interface RoutePerformanceTableProps {
  data: RoutePerformance[];
}

// TO DO : Fix the graphical presentation
export function RoutePerformanceTable({data}: RoutePerformanceTableProps): JSX.Element {
    const [Routes, setRoutes] = useState<Routes[] | null>(null);

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
      data={data}
      keyExtractor={(item) => item.performance_id.toString()}
      renderItem={renderRow}
      ListHeaderComponent={() => (
        <View style={[styles.row, styles.header]}>
          <Text style={[styles.cell, styles.headerText]}>Route</Text>
          <Text style={[styles.cell, styles.headerText]}>Time</Text>
          <Text style={[styles.cell, styles.headerText]}>Heart Rate Start</Text>
          <Text style={[styles.cell, styles.headerText]}>Heart Rate End</Text>
          {/* Add more header columns as needed */}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
    container: {
      margin: 10,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1, // Add a border to separate rows
      borderBottomColor: '#ccc', // Border color
    },
    cell: {
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