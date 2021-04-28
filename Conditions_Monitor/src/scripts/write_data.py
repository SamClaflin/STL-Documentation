#!venv/bin/python3

import time
import boto3
import random
from botocore.config import Config


# Function to initialize a Timestream write client object given a boto3 session
def init_client_write(session: boto3.Session) -> boto3.Session.client:
    return session.client("timestream-write", config=Config(read_timeout=20, max_pool_connections=5000,
                                                            retries={"max_attempts": 10}))


# Function to initialize a Timestream query client given a boto3 session
def init_client_query(session: boto3.Session) -> boto3.Session.client:
    return session.client("timestream-query")


# Function to ingest data into a given Timestream table within a given Timestream DB
def ingest_data(write_client: boto3.Session.client, device: str, r_min: float, r_max: float, curr_time: str):
    # curr_time = get_curr_time_milli()

    # Initialize dimensions (metadata)
    dimensions = [
        {"Name": "region", "Value": "us-east-1"},
        {"Name": "device_group", "Value": "ah-sms"},
        {"Name": "device", "Value": device},
    ]

    # Initialize measures (data)
    temperature = {
        "Dimensions": dimensions,
        "MeasureName": "temperature",
        "MeasureValue": str(round(random.uniform(r_min, r_max))),
        "MeasureValueType": "DOUBLE",
        "Time": curr_time
    }

    # Store all measures as a list of records
    records = [temperature]

    # Write data
    try:
        result = write_client.write_records(DatabaseName="Iot-Test", TableName="TestTable", Records=records,
                                            CommonAttributes={})
    except write_client.exceptions.RejectedRecordsException as err:
        print(f"Rejected Records: {err}")
    except Exception as err:
        print(f"Error: {err}")


# Function to retrieve the current time in milliseconds
def get_curr_time_milli() -> str:
    return str(int(round(time.time() * 1000)))


def main():
    # Initialize session and clients
    session = boto3.Session()
    write_client = init_client_write(session)
    query_client = init_client_query(session)

    # Write sample data to Timestream DB
    devices = [
        "laser-boiler-hot-in",
        "laser-boiler-hot-out",
        "laser-chill-in",
        "laser-chill-out",
        "ahu1-humidity",
        "wband-vent-temp",
        "wband-air-temp",
        "co2-ppm",
        "voc-air-quality",
    ]
    ranges = [(135.0, 140.0), (135.0, 140.0), (32.0, 40.0), (35.0, 42.0), (30.0, 32.0), (64.0, 73.0), (71.0, 72.0), (40.0, 46.0), (0.0, 20.0)]

    num_instances = 60 * 12 
    curr_time = get_curr_time_milli()
    for i in range(num_instances):
        for j, device in enumerate(devices): 
            ingest_data(write_client, device, ranges[j][0], ranges[j][1], curr_time)
        curr_time = str(int(curr_time) + 60000) 
        print(f"Data instance {i + 1} of {num_instances} processed...")
        time.sleep(0.75)


if __name__ == '__main__':
    main()
