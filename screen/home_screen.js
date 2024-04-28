import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchForecast, searchLocation } from "../network/network_call";
import * as Location from "expo-location";
import { convertEpochToDay, convertEpochToTime } from "../utils/converter";
import AutocompleteInput from "react-native-autocomplete-input";

export default homeScreen = () => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [currentForecast, setCurrentForecast] = useState(null);
  const [query, setQuery] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [forecastDay, setForecastDay] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      callFetchForecastApi(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  useEffect(() => {
    if (query.length > 2) {
      callSearchLocationApi();
    }
  }, [query]);

  const callSearchLocationApi = async () => {
    try {
      var result = await searchLocation(query);
      setSearchData(result.data);
    } catch (error) {
      console.log("Error :: ", error);
    }
  };

  const callFetchForecastApi = async (latitude, longitude) => {
    try {
      var result = await fetchForecast(latitude, longitude, 7);
      setCurrentForecast(result);
      setForecastDay(result?.data?.forecast?.forecastday);
    } catch (error) {
      console.log("Error :: ", error);
    }
  };

  const handleSelectLocation = (item) => {
    setQuery("");
    setSearchData([]);
    setCurrentForecast(null);
    callFetchForecastApi(item.lat, item.lon);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {currentForecast === null ? (
        <ActivityIndicator className="flex-1 justify-center items-center align-items" />
      ) : (
        <ScrollView>
          <View className="mt-5">
            <AutocompleteInput
              placeholder="Search"
              placeholderTextColor="#5c5754"
              data={searchData}
              value={query}
              onChangeText={(text) => setQuery(text)}
              flatListProps={{
                keyExtractor: (_, idx) => idx,
                renderItem: ({ item }) => (
                  <TouchableOpacity
                    className="p-2 m-2 bg-slate-100"
                    onPress={() => handleSelectLocation(item)}
                  >
                    <Text>
                      {item.name}, {item.region}, {item.country}
                    </Text>
                  </TouchableOpacity>
                ),
              }}
            />
          </View>
          <View className="mt-10 items-center">
            <Text className="text-white text-3xl font-bold">
              {currentForecast?.data?.location?.name}
            </Text>
            <Text className="text-white text-sm font-medium">
              {currentForecast?.data?.location?.country}
            </Text>
          </View>

          <View className="mt-5 mb-40 items-center">
            <Image
              source={{
                uri: `https:${currentForecast?.data?.current?.condition?.icon}`,
                height: 150,
                width: 150,
              }}
            />
            <Text className="text-white text-3xl font-bold">
              {currentForecast?.data?.current?.condition?.text}
            </Text>
            <Text className="text-white text-xl font-bold">
              {currentForecast?.data?.current?.temp_c}°C
            </Text>
          </View>
          <ScrollView
            horizontal
            contentContainerStyle={{ paddingHorizontal: 15 }}
            showsHorizontalScrollIndicator={false}
          >
            {forecastDay?.map((data, index) => (
              <View
                className="items-center w-[120px] py-3 mr-4 backdrop-blur-sm bg-white/30 rounded-xl"
                key={index}
              >
                <Text className="text-white text-sm font-medium">
                  {convertEpochToTime(data?.date_epoch)}
                </Text>
                <Text className="text-white text-sm font-medium">
                  {convertEpochToDay(data?.date_epoch)}
                </Text>

                <Image
                  source={{
                    uri: `https:${data?.day?.condition?.icon}`,
                    height: 50,
                    width: 50,
                  }}
                />
                <Text className="text-white text-sm font-bold">
                  {data?.day?.condition?.text}
                </Text>
                <Text className="text-white text-sm font-normal">
                  {data?.day?.avgtemp_c}°C
                </Text>
              </View>
            ))}
          </ScrollView>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};
