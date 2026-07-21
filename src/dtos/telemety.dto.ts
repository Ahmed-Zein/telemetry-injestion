interface TelemetryDto {
  batteryPercentage: number;
  temperature: number;
  // TODO: we can Geomety Objcect in the db with a spatial index, but for now we will use two separate fields for latitude and longitude
  gpsLatitude: number;
  gpsLongitude: number;
  status: string;
}

export default TelemetryDto;
