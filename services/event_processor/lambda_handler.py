import json
import os
import boto3
import logging
from datetime import datetime

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize AWS clients
sqs = boto3.client('sqs')
dynamodb = boto3.resource('dynamodb')

# Get environment variables
STAGE = os.environ.get('STAGE', 'dev')
TABLE_NAME = f"carreport-microservices-{STAGE}-cache"

# Get DynamoDB table
table = dynamodb.Table(TABLE_NAME)

def process_event(event_data):
    """Process an event from the SQS queue"""
    try:
        event_type = event_data.get('event_type')
        
        if not event_type:
            logger.error("Event missing event_type")
            return False
        
        logger.info(f"Processing event of type: {event_type}")
        
        # Handle different event types
        if event_type == 'report_generated':
            return process_report_generated_event(event_data)
        elif event_type == 'user_created':
            return process_user_created_event(event_data)
        elif event_type == 'lead_created' or event_type == 'lead_updated':
            return process_lead_event(event_data)
        elif event_type == 'crm_sync':
            return process_crm_sync_event(event_data)
        elif event_type == 'conversation_message':
            return process_conversation_message_event(event_data)
        else:
            logger.warning(f"Unknown event type: {event_type}")
            return True  # Still mark as processed
    
    except Exception as e:
        logger.error(f"Error processing event: {str(e)}")
        return False

def process_report_generated_event(event_data):
    """Process a report generated event"""
    report_id = event_data.get('report_id')
    vin = event_data.get('vin')
    
    if not report_id or not vin:
        logger.error("Report event missing required fields")
        return False
    
    # In a real implementation, you would update analytics, notify users, etc.
    logger.info(f"Report {report_id} generated for VIN {vin}")
    
    # Store in DynamoDB for analytics
    try:
        table.put_item(
            Item={
                'key': f"report:{report_id}",
                'vin': vin,
                'timestamp': event_data.get('timestamp'),
                'ttl': int((datetime.now().timestamp() + 60*60*24*30))  # 30 days TTL
            }
        )
        return True
    except Exception as e:
        logger.error(f"Error storing report event: {str(e)}")
        return False

def process_user_created_event(event_data):
    """Process a user created event"""
    user_id = event_data.get('user_id')
    
    if not user_id:
        logger.error("User event missing user_id")
        return False
    
    # In a real implementation, you would send welcome emails, update analytics, etc.
    logger.info(f"User {user_id} created")
    
    return True

def process_lead_event(event_data):
    """Process a lead created or updated event"""
    lead_id = event_data.get('lead_id')
    dealer_id = event_data.get('dealer_id')
    
    if not lead_id or not dealer_id:
        logger.error("Lead event missing required fields")
        return False
    
    # In a real implementation, you would notify dealers, update CRM systems, etc.
    logger.info(f"Lead {lead_id} event for dealer {dealer_id}")
    
    return True

def process_crm_sync_event(event_data):
    """Process a CRM sync event"""
    crm_provider_id = event_data.get('crm_provider_id')
    entity_type = event_data.get('entity_type')
    entity_id = event_data.get('entity_id')
    
    if not crm_provider_id or not entity_type or not entity_id:
        logger.error("CRM sync event missing required fields")
        return False
    
    # In a real implementation, you would update sync status, retry failed syncs, etc.
    logger.info(f"CRM sync for {entity_type} {entity_id} with provider {crm_provider_id}")
    
    return True

def process_conversation_message_event(event_data):
    """Process a conversation message event"""
    conversation_id = event_data.get('conversation_id')
    user_id = event_data.get('user_id')
    
    if not conversation_id:
        logger.error("Conversation event missing conversation_id")
        return False
    
    # In a real implementation, you would update analytics, train AI models, etc.
    logger.info(f"Conversation {conversation_id} message event")
    
    return True

def handler(event, context):
    """Lambda handler for processing SQS events"""
    if not event or 'Records' not in event:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid event format'})
        }
    
    processed_count = 0
    failed_count = 0
    
    for record in event['Records']:
        try:
            # Extract message body
            body = json.loads(record['body'])
            
            # Process the event
            success = process_event(body)
            
            if success:
                processed_count += 1
            else:
                failed_count += 1
        
        except Exception as e:
            logger.error(f"Error processing record: {str(e)}")
            failed_count += 1
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'processed': processed_count,
            'failed': failed_count
        })
    }

