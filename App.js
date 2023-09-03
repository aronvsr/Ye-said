import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator, Image, TouchableOpacity, Share, RefreshControl, SafeAreaView, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [quote, setQuote] = useState(null);
  const [firstOpen, setFirstOpen] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setFirstOpen(false);
    setRefreshing(true);
    setTimeout(() => {
    fetch('https://bpstudios.nl/daily_ye_backend/get_quote.php')
    .then((response) => response.text())
    .then((data) => {
      // Set the fetched quote in the state.
      setRefreshing(false); 
      setTimeout(() => {
        setQuote(data);
      }, 250); 
    })
    .catch((error) => {
      console.error(error);
    });
  }, 500); 
  }, []);

  const checkAndSetOpenedBefore = async () => {
    try {
      const openedBefore = await AsyncStorage.getItem('openedBefore');
      if (openedBefore == null) {
        setFirstOpen(true);
        AsyncStorage.setItem('openedBefore', 'true');
      }
    } catch (error) {
      console.error('Error checking and setting values:', error);
    }
  };

  useEffect(() => {
    fetchQuote();
    checkAndSetOpenedBefore();
  }, []);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `"${quote}"\n\n- Kanye West`,
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const fetchQuote = async () => {
    fetch('https://bpstudios.nl/daily_ye_backend/get_quote.php')
    .then((response) => response.text())
    .then((data) => {
      // Set the fetched quote in the state.
      setQuote(data);
    })
    .catch((error) => {
      console.error(error);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor="#000" />
        }>
        { firstOpen == true && quote ? (<Text style={styles.tipText}>SWIPE DOWN FOR NEW QUOTE</Text>) : (null)}
        <View style={styles.quoteAndCreditContainer}>
          <TouchableOpacity style={styles.quoteContainer} onPress={() => onShare()}>
            {
              !quote ? (
                <View style={styles.activityIndicatorContainer}>
                  <ActivityIndicator size="large" color='black' />
                </View>
              ) : (
                <Text style={styles.quoteText}>{quote}</Text>
              )
            }
          </TouchableOpacity>
          {quote ? (<Text style={styles.kanyeText}>KANYE WEST</Text>) : (null)}
        </View>
        {quote ? (
          <View style={styles.parentalAdvisoryContainer}>
              <Image
                style={styles.parentalAdvisory}
                resizeMode='contain'
                source={require('./assets/parental-advisory.png')}
              />
          </View>
          ) : (
            null
          )
        } 
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#F78C58', // Dark theme background color
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    position: 'absolute',
    top: 80,
    fontSize: 22,
    color: 'rgba(0, 0, 0, 0.6)', // Header text color
    marginBottom: 20,
  },
  quoteContainer: {
    padding: 10,
    backgroundColor: '#F78C58',
  },
  quoteText: {
    fontFamily: 'Helvetica',
    fontSize: 22,
    fontWeight: '600',
    color: '#000', // Quote text color
    textAlign: 'center',
  },
  kanyeText: {
    fontFamily: 'Helvetica',
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  quoteAndCreditContainer: {
    paddingVertical: 20, 
    marginHorizontal: '10%',
    marginBottom: 150,
  },
  parentalAdvisoryContainer: {
    position: 'absolute',
    bottom: 100,
    width: 75,
    height: 50,
  },
  parentalAdvisory: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain' 
  },
  activityIndicatorContainer: {
    height: 100,
    width: 220,
  },
  tipText: {
    textAlign: 'center',
    position: 'absolute',
    fontFamily: 'Helvetica',
    top: 40,
    fontWeight: 'bold',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.8)', // Header text color
  }
});
