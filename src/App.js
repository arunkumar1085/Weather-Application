import React, { useState } from "react";
import styled, { keyframes, ThemeProvider } from "styled-components";

const lightTheme = {
  background: "linear-gradient(to right top, #74ebd5, #acb6e5)",
  cardBg: "#ffffffcc",
  text: "#333",
  button: "#0077ff",
  buttonText: "white",
  forecastBg: "#ffffffbb",
};

const darkTheme = {
  background: "linear-gradient(to right top, #2c3e50, #4ca1af)",
  cardBg: "#1f1f1fcc",
  text: "#f1f1f1",
  button: "#555",
  buttonText: "#eee",
  forecastBg: "#2c2c2cbb",
};

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const floatCloud = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100vw); }
`;

const Container = styled.div`
  font-family: "Segoe UI", sans-serif;
  background: ${(props) => props.theme.background};
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  transition: 0.4s;
`;

const Cloud = styled.div`
  position: absolute;
  top: ${(props) => props.top || "10%"};
  left: -200px;
  width: 200px;
  height: 100px;
  background: url("https://cdn-icons-png.flaticon.com/512/1163/1163624.png")
    no-repeat center/contain;
  animation: ${floatCloud} ${(props) => props.speed || "40s"} linear infinite;
  opacity: 0.3;
`;

const WeatherBox = styled.div`
  text-align: center;
  background-color: ${(props) => props.theme.cardBg};
  backdrop-filter: blur(10px);
  padding: 30px 25px;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  width: 360px;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${fadeIn} 0.8s ease-in-out;
  z-index: 1;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${(props) => props.theme.text};
`;

const SubIcon = styled.img`
  width: 90px;
  margin: 10px auto 15px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1rem;
  border: 2px solid #aaa;
  border-radius: 8px;
  margin-bottom: 10px;
  width: 80%;
  outline: none;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 1rem;
  border: none;
  background-color: ${(props) => props.theme.button};
  color: ${(props) => props.theme.buttonText};
  border-radius: 8px;
  cursor: pointer;
  width: 80%;
  margin-bottom: 10px;
  transition: background-color 0.3s ease;
`;

const Info = styled.div`
  animation: ${fadeIn} 0.6s ease;
`;

const Icon = styled.img`
  width: 70px;
  margin: 10px 0;
`;

const Temperature = styled.p`
  font-size: 2rem;
  font-weight: bold;
  color: ${(props) => props.theme.text};
`;

const Condition = styled.p`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${(props) => props.theme.text};
  text-transform: capitalize;
  margin: 8px 0;
`;

const Humidity = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: #0077ff;
  margin: 5px 0;
`;

const Toggle = styled.div`
  margin: 10px 0;
  font-weight: bold;
  font-size: 0.95rem;
  cursor: pointer;
  color: #0077ff;
  text-decoration: underline;
`;

const Suggestion = styled.p`
  margin-top: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  background: #e3f2fd;
  padding: 8px;
  border-radius: 8px;
`;

const ForecastItem = styled.div`
  background: ${(props) => props.theme.forecastBg};
  padding: 10px;
  border-radius: 12px;
  margin: 8px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${(props) => props.theme.text};
`;

const ForecastText = styled.div`
  text-align: left;
`;

const App = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState("");
  const [unitF, setUnitF] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const apiKey = "6fe8ad855df25119d00844c46674969a";

  const convertTemp = (temp) =>
    unitF ? ((temp * 9) / 5 + 32).toFixed(1) : temp.toFixed(1);

  const getSuggestion = (condition, temp, wind) => {
    const cond = condition.toLowerCase();
    if (cond.includes("rain")) return "☔ Carry an umbrella today!";
    if (cond.includes("clear")) return "😎 Wear sunglasses!";
    if (temp < 10) return "🧥 It's cold, wear a jacket.";
    if (temp > 32) return "💧 Stay hydrated in this heat!";
    if (wind > 8) return "🌬️ It's windy outside!";
    return "✅ Weather looks fine today.";
  };

  const getWeather = async () => {
    const res1 = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const res2 = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    const data1 = await res1.json();
    const data2 = await res2.json();
    setWeather(data1);
    setForecast(
      data2.list.filter((d) => d.dt_txt.includes("12:00:00")).slice(0, 5)
    );
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container>
        <Cloud top="15%" speed="60s" />
        <Cloud top="35%" speed="45s" />
        <Cloud top="55%" speed="70s" />
        <WeatherBox>
          <Title>Weather App</Title>
          <SubIcon
            src="https://cdn-icons-png.flaticon.com/512/1163/1163661.png"
            alt="cloud"
          />
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter City"
          />
          <Button onClick={getWeather}>Get Weather</Button>
          <Toggle onClick={() => setUnitF(!unitF)}>
            Switch to {unitF ? "°C" : "°F"}
          </Toggle>
          <Toggle onClick={() => setDarkMode(!darkMode)}>
            Toggle {darkMode ? "Light" : "Dark"} Mode
          </Toggle>

          {weather && (
            <Info>
              <h2>{weather.name}</h2>
              <Icon
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />
              <Temperature>
                {convertTemp(weather.main.temp)}°{unitF ? "F" : "C"}
              </Temperature>
              <Condition>{weather.weather[0].description}</Condition>
              <Humidity>Humidity: {weather.main.humidity}%</Humidity>
              <Suggestion>
                {getSuggestion(
                  weather.weather[0].description,
                  weather.main.temp,
                  weather.wind.speed
                )}
              </Suggestion>
            </Info>
          )}

          {forecast.length > 0 && (
            <div>
              <h3>5-Day Forecast</h3>
              {forecast.map((day, idx) => (
                <ForecastItem key={idx}>
                  <ForecastText>
                    <strong>{new Date(day.dt_txt).toLocaleDateString()}</strong>
                    <div>{day.weather[0].description}</div>
                  </ForecastText>
                  <div>
                    <img
                      src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                      alt="forecast"
                      width="50"
                    />
                    <div style={{ fontWeight: "bold" }}>
                      {convertTemp(day.main.temp)}°{unitF ? "F" : "C"}
                    </div>
                  </div>
                </ForecastItem>
              ))}
            </div>
          )}
        </WeatherBox>
      </Container>
    </ThemeProvider>
  );
};

export default App;
