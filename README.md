# CarReport Microservices Architecture

This repository contains the microservices architecture for CarReport, a vehicle history and research platform. The architecture is designed for scalability, fault isolation, and modular deployment.

## Microservices Overview

The platform is divided into the following microservices:

1. **Authentication & User Management Service**
   - Implements JWT authentication
   - Manages user profiles and subscriptions
   - Handles payment history

2. **Report Generation Service**
   - Fetches vehicle history from VINData, KBB, NMVTIS APIs
   - Generates structured vehicle reports
   - Caches recent reports for fast retrieval

3. **AI Agent Service**
   - Takes user queries and returns insights from vehicle history data
   - Uses GPT-based AI to explain report findings
   - Stores user chat history for improved recommendations

4. **Dealer Dashboard Service**
   - Tracks dealership leads and report usage
   - Manages dealer subscriptions and CRM integration

5. **CRM Integration Service**
   - Syncs leads with HubSpot, Salesforce, DealerSocket
   - Pushes purchase-ready leads to the correct dealer

6. **Analytics & Monitoring Service**
   - Tracks total reports generated per day, week, month
   - Monitors API response times & error rates for VINData & KBB
   - Logs most searched makes/models & locations for dealer outreach

## Tech Stack

- **Backend**: FastAPI (Python)
- **Storage**: PostgreSQL, Redis for caching
- **Compute**: Vercel Edge Functions / AWS Lambda
- **Communication**: API Gateway + Redis Pub/Sub for event-driven tasks

## Getting Started

### Prerequisites

- Python 3.9+
- Docker and Docker Compose
- PostgreSQL
- Redis

### Installation

1. Clone the repository:

