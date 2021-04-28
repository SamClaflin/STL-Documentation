# Timestream Rule Creation
- Timestream rule creation:
    * done through the AWS IoT Core management console
    * steps:
        1. Name rule
        2. Write SQL statement that determines which measures to query
        3. Select rule (Write to Timestream)
        4. Fill out dimensions (follow format above)
        5. Define/Create a role (grant IoT Core permission to write to Timestream DB) (ensure policy attached is enabled)
        6. Create rule