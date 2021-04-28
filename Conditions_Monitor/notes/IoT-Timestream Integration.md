# IoT-Timestream Integration
- AWS IoT Core allows for IoT devices to be easily integrated with 
- IoT Core has built in bindings for Timestream that allow for the pushing 
    of data directly from devices into a Timestream database 
- IoT Core Timestream integration:
	- INGESTION: [[IoT-Timestream Ingestion]]
    * DOCUMENTATION: https://docs.aws.amazon.com/timestream/latest/developerguide/IOT-Core.html
    * PROJECT EXAMPLE: https://github.com/awslabs/amazon-timestream-tools/blob/master/integrations/iot_core
    * data is collected FROM devices BY IoT Core 
    * data is routed through IoT Core to Timestream through IoT Core 
        RULE ACTIONS  
    * rule actions specify what to do when a rule is triggered  
    * actions can be defined to send data to a Timestream table, DynamoDB
        database, and invoke an AWS Lambda function
    * the Timestream action in IoT Rules is used to insert data from
        incoming messages directly into Timestream 
    * the action parses the results of the IoT Core SQL statement and 
        stores the data into Timestream 
    * the names of the fields from the returned SQL result are used as the 
        measure::name and the value of the field is the measure::value 
    * measure::name: column in table 
    * measure::value: data for measure::name
    * ex.:
	```python
        SELECT temperature, humidity from 'iot/topic'
        >>> {
                "dataFormat": 5, 
                "rssi": -88,
                "temperature": 24.04,    
                "humidity": 43.605,    
                "pressure": 101082,    
                "accelerationX": 40,    
                "accelerationY": -20,    
                "accelerationZ": 1016,    
                "battery": 3007,    
                "txPower": 4,    
                "movementCounter": 219,    
                "device_id": 46216,
                "device_firmware_sku": 46216   
            }
	```
	
    * if an IoT Core rule action for Timestream is created with the 
        SQL statement above, two records will be added to Timestream
        with measure names "temperature" and "humidity" and measure 
        values of 24.04 and 43.605 respectively
    * measure names of a record being added to Timestream can be modified 
        using the AS operator in the SELECT statement 
    * data type of the measure are inferred from the data type of the 
        value of the message payload 
    * timestamp of the measure CAN be specified manually; if left blank, 
        the time that the entry was processed is used 