//Selectors
const ipText = document.querySelector(".ip-text");
const locationText = document.querySelector(".location");
const timeZoneText = document.querySelector(".timezone");
const ispText = document.querySelector(".isp-text");
const mapContainer = document.querySelector("#map");
const button = document.querySelector(".find");
const form = document.querySelector("form");

//Functions
const loadMap = function (lat, lng, city) {
  let container = L.DomUtil.get("map");

  if (container != null) {
    container.remove();
    const reCreateMap = document.getElementById("contain-map");
    reCreateMap.innerHTML = '<div id="map"></div>';
  }

  let mymap = L.map("map").setView([lat, lng], 17);

  let marker = L.marker([lat, lng])
    .addTo(mymap)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
      })
    )
    .setPopupContent(`${city}`)
    .openPopup();

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    minZoom: 3,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mymap);
};

const loadData = async function (ip) {
  try {
    const res = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_YSAqAwmRYWFzkZFcFIfYgysPYiy7I&ipAddress=${ip}`
    );

    const data = await res.json();
    console.log(data);

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    const ipAddress = data.ip;
    const country = data.location.country;
    const city = data.location.city;
    const timeZone = data.location.timezone;
    const isp = data.isp;
    const latitude = data.location.lat;
    const longitude = data.location.lng;

    ipText.textContent = `${ipAddress}`;
    locationText.textContent = `${country}, ${city}`;
    timeZoneText.textContent = `UTC ${timeZone}`;
    ispText.textContent = `${isp}`;

    loadMap(latitude, longitude, city);
  } catch (err) {
    console.error(err);
  }
};

const trackIP = async function (e) {
  e.preventDefault();

  const input = document.querySelector(".input");

  const IP = input.value;

  if (!IP) return;

  await loadData(IP);

  input.value = "";
};

//Events
let mapDefault = L.map("map").setView([34.04915, -118.09462], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(mapDefault);

L.marker([34.04915, -118.09462])
  .addTo(mapDefault)
  .bindPopup(
    L.popup({
      maxWidth: 250,
      minWidth: 100,
      autoClose: false,
      closeOnClick: false,
    })
  )
  .setPopupContent("Location")
  .openPopup();

button.addEventListener("click", trackIP);

form.addEventListener("submit", trackIP);
