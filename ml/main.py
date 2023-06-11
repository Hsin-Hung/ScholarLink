import pika, sys, os
from recommender import process

def main():
   connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
   channel = connection.channel()

   channel.queue_declare(queue='task_queue', durable=True)
   print(' [*] Waiting for messages. To exit press CTRL+C')

   def callback(ch, method, properties, body):
      print(" [x] Received %r" % body.decode())
      process(body.decode())
      ch.basic_ack(delivery_tag = method.delivery_tag)

   channel.basic_qos(prefetch_count=1)
   channel.basic_consume(queue='task_queue', on_message_callback=callback)
    
   channel.start_consuming()

if __name__ == '__main__':
   try:
      main()
   except KeyboardInterrupt:
      print('Interrupted')
      try:
         sys.exit(0)
      except SystemExit:
         os._exit(0)