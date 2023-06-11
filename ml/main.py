import pika, sys, os
from recommender import process

def main():
   connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
   channel = connection.channel()

   channel.queue_declare(queue='task_queue', durable=True)
   print(' [*] Waiting for messages. To exit press CTRL+C')

   def callback(ch, method, properties, body):
      print(" [x] Received %r" % body.decode())
      print(" [x] Received properties %r" % properties.message_id)
      process(body.decode(), properties.message_id)
      ch.basic_ack(delivery_tag = method.delivery_tag)

   channel.basic_qos(prefetch_count=1)
   channel.basic_consume(queue='task_queue', on_message_callback=callback)
    
   try:
      channel.start_consuming()
   except KeyboardInterrupt:
      channel.stop_consuming()
   connection.close()

if __name__ == '__main__':
   try:
      main()
   except KeyboardInterrupt:
      print('Interrupted')
      try:
         sys.exit(0)
      except SystemExit:
         os._exit(0)