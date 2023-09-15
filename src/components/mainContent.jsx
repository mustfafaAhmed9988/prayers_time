import Grid from "@mui/material/Grid";
import PrayerCard from "./card";
import { Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import axios from "axios";
import { useState, useEffect } from "react";
import { cities, prayerArray } from "../assets/data";
import moment from "moment";

import "moment/dist/locale/ar-dz";
moment.locale("ar");
export default function MainContent() {
  const [loading , setLoading ] = useState(false)
  const [currentDate, setCurrentDate] = useState("");
  const [timings, setTimings] = useState({
    //  Fajr:"4:20"
  });
  const [timer, setTimer] = useState("");
  const [displayTimer, setDisplayTimer] = useState("");
  const [city, setCity] = useState({
    name: "الاسكندرية",
    code: "Al Iskandariyah",
  });
  const [prayerIndex, setPrayerIndex] = useState(null);

  const handleCityChange = (value) => {
    setCity(value.target.value);
  };
  const fetchingData = async ({ code }) => {
    let params = {
      country: "EGY",
      city: code,
    };
    const response = await axios.get(
      "https://api.aladhan.com/v1/timingsByCity",
      {
        params: params,
      }
    );
    setTimings(response.data.data.timings);
  };
  useEffect(() => {
    fetchingData(city);
  }, [city]);

  useEffect(() => {
    setCurrentDate(moment().format("MMMM Do YYYY | h:mm"));
    let interval = setInterval(() => {
      setTimer(setUpCountDownTimer());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timings]);
  const setUpCountDownTimer = () => {
    const currentTime = moment();
    let localPrayerIndex = null;
    if (
      currentTime.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      currentTime.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ) {
      localPrayerIndex = 1;
    } else if (
      currentTime.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      currentTime.isBefore(moment(timings["Asr"], "hh:mm"))
    ) {
      localPrayerIndex = 2;
    } else if (
      currentTime.isAfter(moment(timings["Asr"], "hh:mm")) &&
      currentTime.isBefore(moment(timings["Maghrib"], "hh:mm"))
    ) {
      localPrayerIndex = 3;
    } else if (
      currentTime.isAfter(moment(timings["Maghrib"], "hh:mm")) &&
      currentTime.isBefore(moment(timings["Isha"], "hh:mm"))
    ) {
      localPrayerIndex = 4;
    } else {
      localPrayerIndex = 0;
    }
    setPrayerIndex(localPrayerIndex);
    setLoading(true)
    const timeObejct = prayerArray[localPrayerIndex];
    const nextPrayerTime = timings[timeObejct.key];
    let remainingTime = moment(nextPrayerTime, "hh:mm").diff(currentTime);
    if (remainingTime < 0) {
      const midNightDiff = moment("23:59:59", "hh:mm").diff(currentTime);
      const fajrToMidNight = moment(nextPrayerTime, "hh:mm").diff(
        moment("00:00", "hh:mm")
      );
      const totalDiff = midNightDiff + fajrToMidNight;
      remainingTime = totalDiff;
    }

    const duration = moment.duration(remainingTime);
    setDisplayTimer(
      `${duration.seconds()} :${duration.minutes()} : ${duration.hours()} `
    );
  };
  return (
    <>
      {/* top row  */}
      <Grid container spacing={1} width={"100vw"} paddingX={1}>
        <Grid item xs={12} sm={4} md={6}>
          <h3>{currentDate}</h3>
          <h3>{city.name}</h3>
        </Grid>
        <Grid item xs={12} sm={4} md={6}>
          <h3>متبقي حتي صلاة {loading ?  prayerArray[prayerIndex]?.displayName : "(يرجي الانتظار  )" } </h3>{" "}
          <h3>{displayTimer}</h3>
        </Grid>
      </Grid>
      <Divider
        style={{
          borderColor: "white",
          opacity: 0.3,
        }}
      ></Divider>
      {/* end of the top row  */}
      {/* cards section  */}
      <Grid container spacing={1} width={"100vw"} paddingY={2}>
        <Grid item xs={12} sm={4} md={2.4}>
          <PrayerCard
            name={"الفجر"}
            url={"/images/fajr.png"}
            time={timings.Fajr}
          ></PrayerCard>
        </Grid>
        <Grid item xs={12} sm={4} md={2.4}>
          <PrayerCard
            name={"الظهر"}
            url={"/images/duhr.png"}
            time={timings.Dhuhr}
          ></PrayerCard>
        </Grid>
        <Grid item xs={12} sm={4} md={2.4}>
          <PrayerCard
            name={"العصر"}
            url={"/images/asr.png"}
            time={timings.Asr}
          ></PrayerCard>
        </Grid>
        <Grid item xs={12} sm={4} md={2.4}>
          <PrayerCard
            name={"المغرب"}
            url={"/images/magrib.png"}
            time={timings.Maghrib}
          ></PrayerCard>
        </Grid>
        <Grid item xs={12} sm={4} md={2.4}>
          <PrayerCard
            name={"العشاء"}
            url={"/images/esha.png"}
            time={timings.Isha}
          ></PrayerCard>
        </Grid>
      </Grid>
      {/* end of cards section  */}
      {/* the start of the select section */}
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FormControl
          sx={{
            width: {
              xs: "100%",
              sm: "50%",
              md: "60%",
            },
            height: "30px",
          }}
        >
          <InputLabel id="demo-simple-select-label">
            <span className="font city">المدينة</span>
          </InputLabel>
          <Select
            defaultValue={cities[1]}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="المدينة"
            sx={{
              height: "2.5rem",
              color: "white",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "& .MuiSvgIcon-root": {
                color: "white",
              },
              ".MuiSelect-outlined": {
                color: "white",
              },
            }}
            onChange={handleCityChange}
          >
            {cities.map((e) => (
              <MenuItem key={e.name} value={e}>
                {e.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {/* the end of the select section */}
    </>
  );
}
