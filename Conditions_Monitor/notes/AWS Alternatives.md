# AWS Alternatives
- final results: [[Final Comparison]]
## SensorCloud
---
### Ingestion
- WSDA-2000: proprietary hardware 
- OpenData API: REST API that allows data to be pushed via the web 
- CSV uploads (irrelevant)

### Data Visualization
- custom dashboards
- automatic graph creation

### Sensor Monitoring
- custom SMS/email alerts 24/7 for any measures 

### Pricing
- Free: 
	- 10 million data points/month (STL needs approximately 8,640,000/month for 200 					points/min) 
	- 25k transations/month (one transaction is something like a single data push, data download, and API calls from custom apps)
	- 1 custom alert 
- Premium:
	- 1 billion data points/month
	- 100k transactions/month
	- unlimited custom alerts 
	
## InfluxData
---
### Ingestion
- Influx CLI 
- InfluxDB API (using curl)
- Client libraries (bindings for virtually all major programming languages)
 
### Integrations
- AWS 
- Docker & K8S
- Slack

### Pricing
- Free (not feasible):
	- 30 days of storage 
	- Alerts only via Slack
	- 1000 kb/s for reads
	- 17 kb/s for writes
	- up to 10k series 
- Usage-Based:
	- limited to 1,000,000 series -> still not feasible 
- Annual:
	- unlimited storage
	- unlimited alerts 
	- unlimited reads, writes, series 
	- yearly contract 


## Balena 
---
### Overview 
- devices in the Balena ecosystem run balenaOS 
- balenaOS is a linux distribution with a built-in, Docker-compatible container engine (balenaEngine)
- balenaEtcher typically used to flash balenaOS images onto devices 
- devices running balenaOS will have a provisioning key automatically generated that links them with the balenaCloud

### Integration
- Balena only allows for direct integration with specific hardware 
- custom devices can be added, but it's extremely costly 
- relatively closed ecosystem; you have to adopt their hardware, operating system, containerizing, deployment methods, etc.

### Pricing
- very expensive compared to other options
- cheapest plan is $99/month and only offers support for 20 unique devices by default  
- the only plan capable of supporting more than 100 unique devices starts at $3000/month

