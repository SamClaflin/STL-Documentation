# IoT-Timestream Ingestion
- video guide: https://www.youtube.com/watch?v=00Wersoz2Q4
- architecture:
    * multiple IoT devices connect to a single IoT Core application
    * "topic rules" are created with AWS IoT Core that describe how to query incoming data from the IoT Devices
    * topic ex.: dt/sensor/device_id
    * payload ex.: 


		```python
        {
            "temperature": 24.342,      -
            "pressure": 31.123,          | measures
            "humidity": 1015.121,       -
            "device_id": "sensor_02",   -
            "building": "Day 1",         | dimensions
            "room": "10.01"             -
        }
		```
   
   * dimensions: attributes that describe the METADATA of the entry in an AWS Timestream
    * measures: attributes that describe the DATA of the entry in an AWS Timestream
    * corresponding IoT rule:


		```python
        # Values obtained from SELECT statement are stored as measures 
        "SELECT humidity, pressure, temperature FROM dt/sensor/#"       # '#' represents wildcard– checking all sensors 
        Rule Action:
        "timestream": {
            "roleArn": "arn:aws:iam::12345678:role/IoTAccessServices",
            "databaseName": "iot",
                "tableName": "sensordatamqtt",
                "dimensions": [
                    {
                        "name": "device_id",
                        "value": "${device_id}"
                    },
                    {
                        "name": "building",
                        "value": "${building}"
                    },
                    {
                        "name": "room",
                        "value": "${room}"
                    },
                ],
        }
		```

[[Timestream Rule Creation]]
